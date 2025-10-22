# Quick Start: Vite Berry Cleanup

## 🚀 Run the Cleanup (3 minutes)

```bash
# 1. Navigate to project root
cd /Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516

# 2. Run safe cleanup script
./scripts/vite_berry_cleanup.sh

# 3. Check for leftovers (optional)
./scripts/find_berry_leftovers.sh

# 4. Verify everything works
npm start
```

## ✅ What You Get

### Scripts Created
- ✅ `scripts/vite_berry_cleanup.sh` - Safe cleanup automation
- ✅ `scripts/find_berry_leftovers.sh` - Audit remaining old code

### Standards Added
- ✅ `.github/PULL_REQUEST_TEMPLATE.md` - PR checklist enforcing standards
- ✅ `VITE_BERRY_STANDARDIZATION.md` - Complete migration guide

### Safety Features
- ✅ Auto-creates git branch with timestamp
- ✅ Backs up src/ before changes
- ✅ Only removes legacy/demo/unused files
- ✅ Keeps all Vite essentials (config, entry points, working pages)

## 📋 Next Steps After Cleanup

1. **Review Changes**
   ```bash
   git status
   git diff
   ```

2. **Create Core Modules** (if not existing)
   ```bash
   mkdir -p src/core/{app-page,filters,export,rbac}
   mkdir -p src/data/{clients,hooks}
   mkdir -p src/features
   ```

3. **Migrate One Page** (Start with Contacts)
   - Wrap in `<AppPage>`
   - Move filters to toolbar
   - Use `useUrlQuery` for URL state
   - Add export functionality
   - Add RBAC gates

4. **Test & Iterate**
   ```bash
   npm start
   npm run lint
   npm run typecheck
   npm run test:e2e
   ```

5. **Commit & Push**
   ```bash
   git add .
   git commit -m "chore: standardize Vite Berry architecture"
   git push origin <branch-name>
   ```

## 🎯 Success Criteria

After cleanup, you should have:
- ✅ Working Vite dev server (`npm start`)
- ✅ No eslint/typescript errors
- ✅ All existing pages still render
- ✅ Backup folder in project root
- ✅ New git branch with changes

## 🆘 Rollback If Needed

```bash
# Check backup location (shown in script output)
ls -la backup_src_*

# Restore from backup
rm -rf src
cp -R backup_src_<timestamp>/src .

# Or revert via git
git checkout <previous-branch>
git branch -D <cleanup-branch>
```

## 📞 Need Help?

1. Check `VITE_BERRY_STANDARDIZATION.md` for detailed guide
2. Review git diff: `git diff --name-only`
3. Run find script: `./scripts/find_berry_leftovers.sh`
4. Contact team lead

---

**Remember:** This is a **safe, reversible** cleanup. Your working app stays intact!

