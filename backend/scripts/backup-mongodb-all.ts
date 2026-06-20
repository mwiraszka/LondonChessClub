import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface BackupConfig {
  backupDir: string;
  maxBackups: number;
  compressionEnabled: boolean;
}

const config: BackupConfig = {
  backupDir: path.join(process.cwd(), 'backups'),
  maxBackups: 7, // Keep last 7 backups per environment
  compressionEnabled: true,
};

interface EnvironmentConfig {
  uri: string;
  database: string;
  name: string;
}

async function loadEnvironment(envFile: string): Promise<EnvironmentConfig> {
  const envPath = path.join(process.cwd(), envFile);

  if (!fs.existsSync(envPath)) {
    throw new Error(`Environment file not found: ${envFile}`);
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const envVars: Record<string, string> = {};

  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });

  if (!envVars['MONGODB_URI'] || !envVars['MONGODB_DATABASE']) {
    throw new Error(`Missing MongoDB configuration in ${envFile}`);
  }

  const envName = envFile.replace('.', '').replace('.env', '');

  return {
    uri: envVars['MONGODB_URI'],
    database: envVars['MONGODB_DATABASE'],
    name: envName,
  };
}

async function createBackup(env: EnvironmentConfig): Promise<void> {
  try {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Starting backup for ${env.name.toUpperCase()} environment`);
    console.log(`${'='.repeat(60)}`);

    // Create backups directory if it doesn't exist
    if (!fs.existsSync(config.backupDir)) {
      fs.mkdirSync(config.backupDir, { recursive: true });
      console.log(`Created backup directory: ${config.backupDir}`);
    }

    // Generate timestamp for backup filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `backup-${env.database}-${timestamp}`;
    const backupPath = path.join(config.backupDir, backupName);

    // Build mongodump command
    const mongodumpCmd = [
      'mongodump',
      `--uri="${env.uri}"`,
      `--db="${env.database}"`,
      `--out="${backupPath}"`,
    ];

    if (config.compressionEnabled) {
      mongodumpCmd.push('--gzip');
    }

    console.log(`Database: ${env.database}`);
    console.log(`Location: ${backupPath}`);
    console.log('Please wait...');

    // Execute mongodump
    const { stderr } = await execAsync(mongodumpCmd.join(' '));

    if (stderr && !stderr.includes('writing')) {
      console.error('Backup warnings/errors:', stderr);
    }

    // Get backup size
    const stats = getDirectorySize(backupPath);
    const sizeMB = (stats / 1024 / 1024).toFixed(2);

    console.log(`✓ Backup completed successfully!`);
    console.log(`  Environment: ${env.name}`);
    console.log(`  Database: ${env.database}`);
    console.log(`  Location: ${backupPath}`);
    console.log(`  Size: ${sizeMB} MB`);
    console.log(`  Time: ${new Date().toISOString()}`);

    // Clean up old backups for this environment
    await cleanupOldBackups(env.database);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('mongodump: command not found')) {
        console.error('\n❌ mongodump is not installed!');
        console.error('Install MongoDB Database Tools:');
        console.error('  macOS: brew install mongodb/brew/mongodb-database-tools');
        console.error(
          '  Linux: https://www.mongodb.com/docs/database-tools/installation/',
        );
        console.error('  Windows: https://www.mongodb.com/try/download/database-tools');
      } else {
        console.error(`Backup failed for ${env.name}:`, error.message);
      }
    }
    throw error;
  }
}

function getDirectorySize(dirPath: string): number {
  let totalSize = 0;

  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      totalSize += getDirectorySize(filePath);
    } else {
      totalSize += stats.size;
    }
  }

  return totalSize;
}

async function cleanupOldBackups(database: string): Promise<void> {
  try {
    const backups = fs
      .readdirSync(config.backupDir)
      .filter(file => file.startsWith(`backup-${database}-`))
      .map(file => ({
        name: file,
        path: path.join(config.backupDir, file),
        time: fs.statSync(path.join(config.backupDir, file)).mtime.getTime(),
      }))
      .sort((a, b) => b.time - a.time); // Sort by newest first

    if (backups.length > config.maxBackups) {
      console.log(
        `\nCleaning up old ${database} backups (keeping last ${config.maxBackups})...`,
      );

      const backupsToDelete = backups.slice(config.maxBackups);
      for (const backup of backupsToDelete) {
        fs.rmSync(backup.path, { recursive: true, force: true });
        console.log(`  Deleted: ${backup.name}`);
      }

      console.log(`✓ Cleanup complete. ${backupsToDelete.length} old backup(s) removed.`);
    }
  } catch (error) {
    console.warn('Warning: Could not clean up old backups:', error);
  }
}

async function listBackups(): Promise<void> {
  try {
    if (!fs.existsSync(config.backupDir)) {
      console.log('No backups found. Backup directory does not exist yet.');
      return;
    }

    const backups = fs
      .readdirSync(config.backupDir)
      .filter(file => file.startsWith('backup-'))
      .map(file => {
        const filePath = path.join(config.backupDir, file);
        const stats = fs.statSync(filePath);
        const sizeMB = (getDirectorySize(filePath) / 1024 / 1024).toFixed(2);

        // Extract environment from filename (backup-dev-... or backup-prod-...)
        const envMatch = file.match(/backup-(dev|prod)-/);
        const environment = envMatch ? envMatch[1] : 'unknown';

        return {
          name: file,
          environment,
          created: stats.mtime,
          size: `${sizeMB} MB`,
        };
      })
      .sort((a, b) => b.created.getTime() - a.created.getTime());

    if (backups.length === 0) {
      console.log('No backups found.');
      return;
    }

    // Group by environment
    const devBackups = backups.filter(b => b.environment === 'dev');
    const prodBackups = backups.filter(b => b.environment === 'prod');

    console.log(`\nFound ${backups.length} backup(s):\n`);

    if (devBackups.length > 0) {
      console.log(`📦 DEV Environment (${devBackups.length} backups):`);
      devBackups.forEach((backup, index) => {
        console.log(`  ${index + 1}. ${backup.name}`);
        console.log(`     Created: ${backup.created.toLocaleString()}`);
        console.log(`     Size: ${backup.size}\n`);
      });
    }

    if (prodBackups.length > 0) {
      console.log(`📦 PROD Environment (${prodBackups.length} backups):`);
      prodBackups.forEach((backup, index) => {
        console.log(`  ${index + 1}. ${backup.name}`);
        console.log(`     Created: ${backup.created.toLocaleString()}`);
        console.log(`     Size: ${backup.size}\n`);
      });
    }
  } catch (error) {
    console.error('Error listing backups:', error);
  }
}

// Main execution
async function main() {
  const command = process.argv[2];

  if (command === 'list') {
    await listBackups();
    return;
  }

  const environments = ['dev', 'prod'];
  let successCount = 0;
  let failCount = 0;

  for (const envName of environments) {
    try {
      const envFile = `.${envName}.env`;
      const env = await loadEnvironment(envFile);
      await createBackup(env);
      successCount++;
    } catch (error) {
      console.error(`\n❌ Failed to backup ${envName}:`, error);
      failCount++;
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('Backup Summary');
  console.log(`${'='.repeat(60)}`);
  console.log(`✓ Successful: ${successCount}`);
  console.log(`✗ Failed: ${failCount}`);
  console.log(`Total backups location: ${config.backupDir}`);
}

main();
