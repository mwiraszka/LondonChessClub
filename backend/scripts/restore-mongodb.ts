import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { promisify } from 'util';

const execAsync = promisify(exec);

const { MONGODB_URI, MONGODB_DATABASE } = process.env;

if (!MONGODB_URI || !MONGODB_DATABASE) {
  throw new Error('MongoDB environment variables are not set.');
}

const backupDir = path.join(process.cwd(), 'backups');

async function listBackups(): Promise<
  Array<{ name: string; path: string; created: Date; size: string }>
> {
  if (!fs.existsSync(backupDir)) {
    console.log('No backups directory found.');
    return [];
  }

  const backups = fs
    .readdirSync(backupDir)
    .filter(file => file.startsWith('backup-'))
    .map(file => {
      const filePath = path.join(backupDir, file);
      const stats = fs.statSync(filePath);
      const sizeMB = (getDirectorySize(filePath) / 1024 / 1024).toFixed(2);

      return {
        name: file,
        path: filePath,
        created: stats.mtime,
        size: `${sizeMB} MB`,
      };
    })
    .sort((a, b) => b.created.getTime() - a.created.getTime());

  return backups;
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

async function restoreBackup(): Promise<void> {
  try {
    console.log('MongoDB Database Restore\n');

    const backups = await listBackups();

    if (backups.length === 0) {
      console.log('No backups found to restore.');
      return;
    }

    console.log('Available backups:\n');
    backups.forEach((backup, index) => {
      console.log(`${index + 1}. ${backup.name}`);
      console.log(`   Created: ${backup.created.toLocaleString()}`);
      console.log(`   Size: ${backup.size}\n`);
    });

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const backupIndex = await new Promise<number>(resolve => {
      rl.question('Select backup to restore (enter number): ', answer => {
        resolve(parseInt(answer) - 1);
      });
    });

    if (backupIndex < 0 || backupIndex >= backups.length) {
      console.log('Invalid selection.');
      rl.close();
      return;
    }

    const selectedBackup = backups[backupIndex];

    console.log(`\n⚠️  WARNING: This will replace your current database!`);
    console.log(`   Database: ${MONGODB_DATABASE}`);
    console.log(`   Backup: ${selectedBackup.name}`);

    const confirmRestore = await new Promise<string>(resolve => {
      rl.question('\nType "RESTORE" to confirm: ', answer => {
        rl.close();
        resolve(answer);
      });
    });

    if (confirmRestore !== 'RESTORE') {
      console.log('Restore cancelled.');
      return;
    }

    console.log('\nRestoring database...');

    // Build mongorestore command
    // Check if backup has database folder structure
    const dbFolders = fs.readdirSync(selectedBackup.path);
    const hasDbFolder = dbFolders.includes('dev') || dbFolders.includes('prod');

    // If backup has a database folder (dev/ or prod/), use the one that exists
    // Otherwise use the backup path directly
    let backupPath = selectedBackup.path;
    if (hasDbFolder) {
      const dbFolder = dbFolders.find(folder => folder === 'dev' || folder === 'prod');
      if (dbFolder) {
        backupPath = path.join(selectedBackup.path, dbFolder);
      }
    }

    const mongorestoreCmd = [
      'mongorestore',
      `--uri="${MONGODB_URI}"`,
      `--db="${MONGODB_DATABASE}"`,
      '--drop', // Drop existing collections before restoring
      '--gzip', // Assume backups are compressed
      `"${backupPath}"`,
    ];

    const { stdout, stderr } = await execAsync(mongorestoreCmd.join(' '));

    if (stderr && !stderr.includes('restoring')) {
      console.error('Restore warnings/errors:', stderr);
    }

    if (stdout) {
      console.log(stdout);
    }

    console.log(`\n✓ Database restored successfully!`);
    console.log(`  Backup: ${selectedBackup.name}`);
    console.log(`  Database: ${MONGODB_DATABASE}`);
    console.log(`  Time: ${new Date().toISOString()}`);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('mongorestore: command not found')) {
        console.error('\n❌ mongorestore is not installed!');
        console.error('Install MongoDB Database Tools:');
        console.error('  macOS: brew install mongodb/brew/mongodb-database-tools');
        console.error(
          '  Linux: https://www.mongodb.com/docs/database-tools/installation/',
        );
        console.error('  Windows: https://www.mongodb.com/try/download/database-tools');
      } else {
        console.error('Restore failed:', error.message);
      }
    }
    process.exit(1);
  }
}

restoreBackup();
