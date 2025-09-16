# 🏌️ King Covy Golf Club - Branch Quick Reference

## 🚀 Quick Commands

### Switch Between Environments:
```bash
# Go to sandbox for testing
git checkout sandbox/experimental-features

# Go back to production
git checkout main

# View backup (read-only)
git checkout backup/stable-site-20250915
```

### Use the Branch Manager Script:
```bash
./scripts/branch-manager.sh
```

## 📋 Branch Overview

| Branch | Purpose | Status | Deploy |
|--------|---------|--------|--------|
| `main` | 🚀 Production | Live site | ✅ Auto-deployed |
| `backup/stable-site-20250915` | 🔒 Backup | Stable version | ❌ Read-only |
| `sandbox/experimental-features` | 🧪 Testing | Experiment safely | ❌ Not deployed |

## 🎯 Workflow

### For Testing New Features:
1. `git checkout sandbox/experimental-features`
2. Make your changes
3. Test locally: `npm run dev`
4. When ready: merge to main

### For Emergency Rollback:
1. `git checkout backup/stable-site-20250915`
2. Create new main from backup
3. Push to restore

## ⚠️ Important Notes

- **Always test in sandbox first!**
- **Main branch = Live website**
- **Backup branch = Safe restore point**
- **Sandbox branch = Safe experimentation**

---
*Quick reference - keep this handy!*
