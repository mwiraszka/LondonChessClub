# MongoDB Backup System

Automated backup solution for the London Chess Club MongoDB database.

## Features

- ✅ **Automated scheduled backups** via cron
- ✅ **Compressed backups** with gzip to save space
- ✅ **Automatic cleanup** - keeps only the last 7 backups
- ✅ **Easy restore** with interactive backup selection
- ✅ **Backup logging** for troubleshooting

## Prerequisites

Install MongoDB Database Tools (includes `mongodump` and `mongorestore`):

**macOS:**

```bash
brew install mongodb/brew/mongodb-database-tools
```

**Linux:**

```bash
# Ubuntu/Debian
wget https://fastdl.mongodb.org/tools/db/mongodb-database-tools-ubuntu2004-x86_64-100.9.4.deb
sudo dpkg -i mongodb-database-tools-ubuntu2004-x86_64-100.9.4.deb
```

**Windows:**
Download from: https://www.mongodb.com/try/download/database-tools

## Quick Start

### 1. Set up automatic backups

Run the setup wizard to configure scheduled backups:

```bash
npm run backup:setup
```

This will:

- Check that `mongodump` is installed
- Create backup scripts
- Let you choose a schedule (daily, weekly, etc.)
- Set up cron jobs for automatic backups

### 2. Run a manual backup

**Backup both dev and prod databases:**

```bash
npm run backup:all
```

**Backup only dev database:**

```bash
npm run backup
```

Backups are stored in `./backups/` directory.

### 3. List all backups

```bash
npm run backup:list
```

Shows backups grouped by environment (dev/prod).

### 4. Restore from backup

```bash
npm run backup:restore
```

This will show you all available backups and let you choose which one to restore.

## Backup Schedule Options

When running `npm run backup:setup`, you can choose from:

1. **Daily at 2:00 AM** - Good for active databases
2. **Daily at 3:00 AM** - Alternative time
3. **Every 12 hours** (2:00 AM and 2:00 PM) - Maximum protection
4. **Weekly on Sunday at 2:00 AM** - Light usage databases
5. **Custom schedule** - Define your own cron schedule
6. **Manual only** - No automatic backups

## Configuration

Edit `scripts/backup-mongodb.ts` to customize:

```typescript
const config: BackupConfig = {
  backupDir: path.join(process.cwd(), 'backups'), // Backup location
  maxBackups: 7, // Number of backups to keep
  compressionEnabled: true, // Use gzip compression
};
```

## File Structure

```
scripts/
├── backup-mongodb.ts           # Main backup script
├── restore-mongodb.ts          # Interactive restore script
├── setup-backup-schedule.sh    # Setup wizard for cron
└── run-backup.sh              # Cron wrapper (auto-generated)

backups/
├── backup-dev-2025-11-19-10-30-00/
├── backup-dev-2025-11-18-10-30-00/
└── backup.log                  # Backup operation logs
```

## Managing Cron Jobs

**View scheduled backups:**

```bash
crontab -l
```

**Edit scheduled backups:**

```bash
crontab -e
```

**Remove scheduled backups:**

```bash
crontab -e
# Delete the line containing "backup-mongodb"
```

## Backup Storage

- **Default location:** `./backups/`
- **Compression:** Enabled by default (gzip)
- **Retention:** Last 7 backups kept per environment (14 total: 7 dev + 7 prod)
- **Typical size:** 1-10 MB per backup (depends on data)
- **Environments:** Dev and prod databases are backed up separately

## Troubleshooting

### mongodump not found

Install MongoDB Database Tools (see Prerequisites above).

### Permission denied

Make sure scripts are executable:

```bash
chmod +x scripts/setup-backup-schedule.sh
chmod +x scripts/run-backup.sh
```

### Cron job not running

Check cron logs:

```bash
# macOS
tail -f /var/log/system.log | grep cron

# Linux
tail -f /var/log/syslog | grep CRON
```

View backup logs:

```bash
cat backups/backup.log
```

### Restore failed

Ensure:

- The backup directory exists and is readable
- MongoDB connection string is valid in `.dev.env`
- You have write permissions to the database

## Security Notes

- ⚠️ Backups contain sensitive data - keep `./backups/` secure
- ⚠️ Never commit `./backups/` to git (already in `.gitignore`)
- ⚠️ Store production backups in encrypted storage
- ⚠️ Consider using MongoDB Atlas automated backups for production

## Additional Resources

- [MongoDB Database Tools Documentation](https://www.mongodb.com/docs/database-tools/)
- [Cron Syntax Guide](https://crontab.guru/)
- [MongoDB Atlas Backups](https://www.mongodb.com/docs/atlas/backup-restore-cluster/)
