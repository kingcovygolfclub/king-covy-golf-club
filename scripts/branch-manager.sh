#!/bin/bash

# King Covy Golf Club - Branch Management Script
# This script helps you easily switch between production, backup, and sandbox environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🏌️  King Covy Golf Club - Branch Manager${NC}"
echo "=================================="

# Function to show current branch status
show_status() {
    echo -e "\n${YELLOW}📊 Current Status:${NC}"
    echo "Current branch: $(git branch --show-current)"
    echo "Last commit: $(git log -1 --pretty=format:'%h - %s (%cr)')"
    echo "Working tree: $(if git diff-index --quiet HEAD --; then echo -e "${GREEN}Clean${NC}"; else echo -e "${RED}Modified${NC}"; fi)"
}

# Function to switch to sandbox
switch_to_sandbox() {
    echo -e "\n${BLUE}🧪 Switching to Sandbox Environment...${NC}"
    git checkout sandbox/experimental-features
    echo -e "${GREEN}✅ Now in sandbox mode - safe to experiment!${NC}"
    echo -e "${YELLOW}💡 Tip: Test new features here before going to production${NC}"
}

# Function to switch to main
switch_to_main() {
    echo -e "\n${BLUE}🚀 Switching to Production Environment...${NC}"
    git checkout main
    echo -e "${GREEN}✅ Now in production mode${NC}"
    echo -e "${RED}⚠️  Warning: Changes here will affect the live site${NC}"
}

# Function to switch to backup
switch_to_backup() {
    echo -e "\n${BLUE}🔒 Switching to Backup Environment...${NC}"
    git checkout backup/stable-site-20250915
    echo -e "${GREEN}✅ Now viewing the stable backup${NC}"
    echo -e "${YELLOW}💡 This is read-only - use for reference or to restore${NC}"
}

# Function to create new backup
create_backup() {
    echo -e "\n${BLUE}💾 Creating New Backup...${NC}"
    BACKUP_NAME="backup/stable-site-$(date +%Y%m%d-%H%M%S)"
    git checkout -b "$BACKUP_NAME"
    git push origin "$BACKUP_NAME"
    echo -e "${GREEN}✅ New backup created: $BACKUP_NAME${NC}"
    git checkout main
}

# Function to show all branches
show_branches() {
    echo -e "\n${YELLOW}🌿 Available Branches:${NC}"
    git branch -a | grep -E "(main|backup|sandbox)" | sed 's/^/  /'
}

# Main menu
show_status

echo -e "\n${YELLOW}What would you like to do?${NC}"
echo "1) 🧪 Switch to Sandbox (experimental-features)"
echo "2) 🚀 Switch to Production (main)"
echo "3) 🔒 View Backup (backup/stable-site-20250915)"
echo "4) 💾 Create New Backup"
echo "5) 🌿 Show All Branches"
echo "6) ❌ Exit"

read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        switch_to_sandbox
        ;;
    2)
        switch_to_main
        ;;
    3)
        switch_to_backup
        ;;
    4)
        create_backup
        ;;
    5)
        show_branches
        ;;
    6)
        echo -e "${GREEN}👋 Goodbye!${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}❌ Invalid choice. Please run the script again.${NC}"
        exit 1
        ;;
esac

echo -e "\n${GREEN}🎯 Branch management complete!${NC}"
