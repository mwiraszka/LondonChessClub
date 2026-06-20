#!/bin/bash

# MongoDB Backup Scheduler Setup Script
# This script helps you set up automated MongoDB backups using cron

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}MongoDB Backup Scheduler Setup${NC}\n"

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Check if mongodump is installed
if ! command -v mongodump &> /dev/null; then
    echo -e "${RED}Error: mongodump is not installed!${NC}"
    echo -e "Install MongoDB Database Tools:"
    echo -e "  macOS: ${YELLOW}brew install mongodb/brew/mongodb-database-tools${NC}"
    echo -e "  Linux: https://www.mongodb.com/docs/database-tools/installation/"
    echo -e "  Windows: https://www.mongodb.com/try/download/database-tools"
    exit 1
fi

echo -e "${GREEN}✓${NC} mongodump is installed\n"

# Check if .dev.env exists
if [ ! -f "$PROJECT_DIR/.dev.env" ]; then
    echo -e "${RED}Error: .dev.env file not found!${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Environment file found\n"

# Create the cron wrapper script
CRON_SCRIPT="$PROJECT_DIR/scripts/run-backup.sh"

cat > "$CRON_SCRIPT" << 'EOF'
#!/bin/bash

# This script is called by cron to run MongoDB backups
# It backs up both dev and prod databases

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Run backup with timestamp logging (backs up both dev and prod)
echo "=== Backup started at $(date) ===" >> "$PROJECT_DIR/backups/backup.log"
cd "$PROJECT_DIR" && npx tsx scripts/backup-mongodb.ts >> "$PROJECT_DIR/backups/backup.log" 2>&1
echo "=== Backup completed at $(date) ===" >> "$PROJECT_DIR/backups/backup.log"
echo "" >> "$PROJECT_DIR/backups/backup.log"
EOF

chmod +x "$CRON_SCRIPT"
echo -e "${GREEN}✓${NC} Created cron wrapper script: $CRON_SCRIPT\n"

# Show schedule options
echo -e "${YELLOW}Choose backup schedule:${NC}"
echo "1) Daily at 2:00 AM"
echo "2) Daily at 3:00 AM"
echo "3) Every 12 hours (2:00 AM and 2:00 PM)"
echo "4) Weekly on Sunday at 2:00 AM"
echo "5) Custom schedule"
echo "6) Skip cron setup (manual backups only)"
echo ""

read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        CRON_SCHEDULE="0 2 * * *"
        DESCRIPTION="Daily at 2:00 AM"
        ;;
    2)
        CRON_SCHEDULE="0 3 * * *"
        DESCRIPTION="Daily at 3:00 AM"
        ;;
    3)
        CRON_SCHEDULE="0 2,14 * * *"
        DESCRIPTION="Every 12 hours (2:00 AM and 2:00 PM)"
        ;;
    4)
        CRON_SCHEDULE="0 2 * * 0"
        DESCRIPTION="Weekly on Sunday at 2:00 AM"
        ;;
    5)
        echo ""
        echo "Enter cron schedule (e.g., '0 2 * * *' for daily at 2 AM):"
        read -p "Schedule: " CRON_SCHEDULE
        DESCRIPTION="Custom: $CRON_SCHEDULE"
        ;;
    6)
        echo -e "\n${GREEN}Setup complete!${NC}"
        echo -e "You can run manual backups with:"
        echo -e "  ${YELLOW}npm run backup${NC} or ${YELLOW}npx tsx --env-file=.dev.env scripts/backup-mongodb.ts${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

# Add to crontab
CRON_JOB="$CRON_SCHEDULE $CRON_SCRIPT"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "$CRON_SCRIPT"; then
    echo -e "\n${YELLOW}Note: A cron job for this backup already exists.${NC}"
    read -p "Do you want to replace it? (y/n): " replace
    if [ "$replace" != "y" ]; then
        echo "Aborted."
        exit 0
    fi
    # Remove old entry
    (crontab -l 2>/dev/null | grep -v "$CRON_SCRIPT") | crontab -
fi

# Add new cron job
(crontab -l 2>/dev/null; echo "# MongoDB backup for london-chess-club"; echo "$CRON_JOB") | crontab -

echo -e "\n${GREEN}✓${NC} Backup scheduled: $DESCRIPTION"
echo -e "\nCron job added:"
echo -e "  ${YELLOW}$CRON_JOB${NC}"

echo -e "\n${GREEN}Setup complete!${NC}\n"
echo "Available commands:"
echo -e "  ${YELLOW}npm run backup${NC}        - Run backup manually"
echo -e "  ${YELLOW}npm run backup:list${NC}   - List all backups"
echo -e "  ${YELLOW}crontab -l${NC}            - View scheduled backups"
echo -e "  ${YELLOW}crontab -e${NC}            - Edit scheduled backups"
echo ""
echo "Backups will be stored in: $PROJECT_DIR/backups/"
echo "Backup logs will be stored in: $PROJECT_DIR/backups/backup.log"
echo ""
echo -e "${YELLOW}Test your backup now:${NC}"
echo -e "  ${YELLOW}npm run backup${NC}"
