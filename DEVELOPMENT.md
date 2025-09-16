# King Covy Development Workflow

This document outlines the development workflow for the King Covy Golf Club e-commerce platform.

## 🏗️ Branch Structure

```
main (production)
├── backup/working-auth-system (backup of working state)
├── sandbox/ux-experiments (UX testing environment)
└── feature/* (individual feature branches)
```

## 🚀 Development Workflow

### 1. **Sandbox Development** (UX Testing)
Use the sandbox environment for experimenting with new UX designs and features.

```bash
# Start sandbox development
npm run sandbox
# or
./scripts/dev-workflow.sh start-sandbox

# Test your changes
npm run test
# or
./scripts/dev-workflow.sh test-sandbox
```

### 2. **Feature Development** (Individual Features)
Create feature branches for specific features or bug fixes.

```bash
# Create a new feature branch
./scripts/dev-workflow.sh create-feature "new-header-design"

# Work on your feature, then test
npm run dev
npm run test
```

### 3. **Deploy to Production**
When sandbox changes are ready, promote them to production.

```bash
# Promote sandbox to production
npm run deploy
# or
./scripts/dev-workflow.sh promote-to-dev
```

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `npm run sandbox` | Start sandbox development environment |
| `npm run dev` | Start regular development environment |
| `npm run test` | Test current changes |
| `npm run deploy` | Deploy sandbox changes to production |
| `npm run workflow` | Show workflow help |

## 🔧 Environment Configuration

### Sandbox Environment
- **File**: `env.sandbox`
- **Purpose**: UX testing and experimentation
- **Features**: Debug mode, feature flags, test credentials

### Production Environment
- **File**: `.env.production`
- **Purpose**: Live production site
- **Features**: Production API endpoints, real credentials

## 📋 Development Process

### For UX Changes:
1. **Start Sandbox**: `npm run sandbox`
2. **Make Changes**: Edit components, styles, layouts
3. **Test Locally**: `npm run test`
4. **Iterate**: Make adjustments as needed
5. **Deploy**: `npm run deploy` when ready

### For New Features:
1. **Create Feature Branch**: `./scripts/dev-workflow.sh create-feature "feature-name"`
2. **Develop**: Work on your feature
3. **Test**: `npm run test`
4. **Merge**: Create pull request to main

## 🎨 UX Experimentation

The sandbox environment includes feature flags for easy experimentation:

```javascript
// Feature flags in env.sandbox
NEXT_PUBLIC_FEATURE_NEW_HEADER=false
NEXT_PUBLIC_FEATURE_NEW_FOOTER=false
NEXT_PUBLIC_FEATURE_NEW_PRODUCT_GRID=false
NEXT_PUBLIC_FEATURE_NEW_CART_DESIGN=false
```

Use these flags to conditionally show/hide new UX elements:

```jsx
{process.env.NEXT_PUBLIC_FEATURE_NEW_HEADER && <NewHeader />}
```

## 🔄 Backup and Recovery

### Current Working State
- **Branch**: `backup/working-auth-system`
- **Contains**: Fully working authentication system
- **Purpose**: Rollback point if needed

### Reset Sandbox
If sandbox gets messy, reset it to main:

```bash
./scripts/dev-workflow.sh reset-sandbox
```

## 📊 Status Checking

Check current development status:

```bash
./scripts/dev-workflow.sh status
```

## 🚨 Emergency Procedures

### Rollback to Working State
```bash
git checkout backup/working-auth-system
git checkout -b emergency-rollback
git push origin emergency-rollback
# Then merge to main
```

### Reset Everything
```bash
git checkout main
git reset --hard backup/working-auth-system
git push origin main --force
```

## 📝 Best Practices

1. **Always test in sandbox first**
2. **Use feature flags for experiments**
3. **Commit frequently with descriptive messages**
4. **Keep backup branch updated**
5. **Test thoroughly before deploying**

## 🎯 Next Steps

1. Start with sandbox: `npm run sandbox`
2. Experiment with UX changes
3. Test thoroughly
4. Deploy when ready: `npm run deploy`

Happy coding! 🚀
