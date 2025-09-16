#!/bin/bash

# King Covy Development Workflow Script
# This script helps manage the development workflow: sandbox → dev → production

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show current branch status
show_status() {
    print_status "Current Development Status:"
    echo "=================================="
    echo "Current branch: $(git branch --show-current)"
    echo "Last commit: $(git log -1 --oneline)"
    echo ""
    echo "Available branches:"
    git branch -a | grep -E "(main|sandbox|backup)" | sed 's/^/  /'
    echo ""
}

# Function to start sandbox development
start_sandbox() {
    print_status "Starting sandbox development..."
    
    # Switch to sandbox branch
    git checkout sandbox/ux-experiments
    print_success "Switched to sandbox/ux-experiments branch"
    
    # Start development server
    print_status "Starting development server..."
    npm run dev
}

# Function to test changes in sandbox
test_sandbox() {
    print_status "Testing sandbox changes..."
    
    # Check if we're on sandbox branch
    if [[ $(git branch --show-current) != "sandbox/ux-experiments" ]]; then
        print_error "Not on sandbox branch. Please run 'start_sandbox' first."
        exit 1
    fi
    
    # Run tests
    print_status "Running tests..."
    npm run lint
    npm run type-check
    
    print_success "Sandbox tests passed!"
}

# Function to promote sandbox to dev
promote_to_dev() {
    print_status "Promoting sandbox changes to development..."
    
    # Check if we're on sandbox branch
    if [[ $(git branch --show-current) != "sandbox/ux-experiments" ]]; then
        print_error "Not on sandbox branch. Please switch to sandbox first."
        exit 1
    fi
    
    # Commit any uncommitted changes
    if [[ -n $(git status -s) ]]; then
        print_status "Committing sandbox changes..."
        git add .
        git commit -m "UX experiments: $(date '+%Y-%m-%d %H:%M:%S')"
    fi
    
    # Push sandbox changes
    git push origin sandbox/ux-experiments
    
    # Switch to main and merge
    git checkout main
    git merge sandbox/ux-experiments --no-ff -m "Merge UX experiments from sandbox"
    
    # Push to main
    git push origin main
    
    print_success "Sandbox changes promoted to main (production)!"
    print_warning "Changes will be deployed automatically via AWS Amplify"
}

# Function to create new feature branch
create_feature() {
    if [[ -z "$1" ]]; then
        print_error "Please provide a feature name: ./dev-workflow.sh create-feature 'feature-name'"
        exit 1
    fi
    
    local feature_name="$1"
    local branch_name="feature/$feature_name"
    
    print_status "Creating feature branch: $branch_name"
    
    # Create and switch to feature branch
    git checkout -b "$branch_name"
    git push origin "$branch_name"
    
    print_success "Feature branch created: $branch_name"
    print_status "You can now work on your feature and test it locally"
}

# Function to reset sandbox to main
reset_sandbox() {
    print_warning "This will reset sandbox to match main branch. All sandbox changes will be lost!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Resetting sandbox to main..."
        
        git checkout sandbox/ux-experiments
        git reset --hard main
        git push origin sandbox/ux-experiments --force
        
        print_success "Sandbox reset to main branch"
    else
        print_status "Reset cancelled"
    fi
}

# Function to show help
show_help() {
    echo "King Covy Development Workflow"
    echo "=============================="
    echo ""
    echo "Usage: ./scripts/dev-workflow.sh [command]"
    echo ""
    echo "Commands:"
    echo "  status              Show current development status"
    echo "  start-sandbox       Start sandbox development environment"
    echo "  test-sandbox        Test sandbox changes"
    echo "  promote-to-dev      Promote sandbox changes to production"
    echo "  create-feature      Create a new feature branch"
    echo "  reset-sandbox       Reset sandbox to match main"
    echo "  help                Show this help message"
    echo ""
    echo "Workflow:"
    echo "  1. start-sandbox    # Start working on UX changes"
    echo "  2. test-sandbox     # Test your changes"
    echo "  3. promote-to-dev   # Deploy to production"
    echo ""
    echo "Examples:"
    echo "  ./scripts/dev-workflow.sh start-sandbox"
    echo "  ./scripts/dev-workflow.sh create-feature 'new-header-design'"
    echo "  ./scripts/dev-workflow.sh promote-to-dev"
}

# Main script logic
case "${1:-help}" in
    "status")
        show_status
        ;;
    "start-sandbox")
        start_sandbox
        ;;
    "test-sandbox")
        test_sandbox
        ;;
    "promote-to-dev")
        promote_to_dev
        ;;
    "create-feature")
        create_feature "$2"
        ;;
    "reset-sandbox")
        reset_sandbox
        ;;
    "help"|*)
        show_help
        ;;
esac
