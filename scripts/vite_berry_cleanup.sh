#!/usr/bin/env bash
set -euo pipefail

echo "== Vite Berry cleanup (safe) =="

branch="chore/vite-berry-cleanup-$(date +%Y%m%d-%H%M%S)"
backup="backup_src_$(date +%Y%m%d-%H%M%S)"

# Ensure git repo
if [ ! -d ".git" ]; then
  echo "Not a git repo. Run at project root."; exit 1
fi

echo "Creating branch: $branch"
git checkout -b "$branch"

# Backup src
if [ -d "src" ]; then
  echo "Backing up ./src -> ./$backup"
  mkdir "$backup"
  cp -R src "$backup/src"
fi

# Keep Vite essentials; prune only obvious legacy/demo bits.
echo "Removing legacy/demo/unused files..."
rm -rf \
  src/**/__old* \
  src/**/legacy \
  src/**/demo \
  src/**/examples \
  || true

# Keep MainLayout, but remove any duplicate layout variants
echo "Cleaning duplicate layouts..."
find src/layout -maxdepth 2 -type d \( -name "old*" -o -name "legacy" -o -name "unused" \) -print0 | xargs -0 rm -rf || true

# Keep your current themes, but remove obvious duplicates
echo "Cleaning duplicate themes..."
find src/themes -maxdepth 2 -type d \( -name "old*" -o -name "legacy" -o -name "unused" \) -print0 | xargs -0 rm -rf || true

# Clean caches
echo "Cleaning caches..."
rm -rf node_modules/.vite .cache coverage || true

# Reinstall
echo "Reinstalling dependencies..."
if command -v pnpm >/dev/null 2>&1; then 
  pnpm i
elif command -v yarn >/dev/null 2>&1; then 
  yarn
else 
  npm i
fi

echo ""
echo "== Done =="
echo "Backup at: $backup"
echo "Branch: $branch"
echo ""
echo "Next steps:"
echo "1. Review changes with: git status"
echo "2. Add standardized modules (AppPage, filters, export, RBAC)"
echo "3. Align theme/layout to Berry standards"
echo "4. Run: npm start to verify everything works"

