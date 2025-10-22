#!/usr/bin/env bash
set -e
echo "== Scanning for old Berry imports & files =="
echo ""

# Search for common old Berry patterns
grep -RIn \
  -e "ui-component" \
  -e "menu-items" \
  -e "MainCard" \
  -e "themes/" \
  -e "store/" \
  -e "@tabler/icons-react" \
  -e "apexcharts" \
  -e "react-perfect-scrollbar" \
  -e "fullcalendar" \
  --exclude-dir=node_modules \
  --exclude-dir=.next \
  --exclude-dir=.git \
  --exclude-dir=dist \
  --exclude-dir=coverage \
  --include="*.ts" \
  --include="*.tsx" \
  --include="*.js" \
  --include="*.jsx" \
  src || echo "No legacy imports found!"

echo ""
echo "== Scan complete =="
echo "Review any imports above and migrate them to use:"
echo "  - AppPage instead of MainCard"
echo "  - Standard MUI icons instead of @tabler"
echo "  - core/ modules for shared functionality"

