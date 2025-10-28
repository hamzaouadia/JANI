#!/bin/bash
# Final cleanup script for JANI project
# Removes build artifacts and standardizes package manager

set -e

echo "🧹 JANI Project Final Cleanup"
echo "=============================="
echo ""

# Confirmation
echo "⚠️  This script will:"
echo "  • Remove build artifacts (.next, dist)"
echo "  • Clean up build cache files"
echo "  • Keep node_modules (reinstall if needed separately)"
echo "  • Standardize on pnpm (remove package-lock.json)"
echo ""
read -p "Continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "🗑️  Removing build artifacts..."

# Remove Next.js build directory
if [ -d "apps/web/.next" ]; then
    rm -rf apps/web/.next
    echo "  ✓ Removed apps/web/.next"
fi

# Remove auth service compiled output
if [ -d "services/auth/dist" ]; then
    rm -rf services/auth/dist
    echo "  ✓ Removed services/auth/dist"
fi

echo ""
echo "🗑️  Removing cache files..."

# Remove TypeScript cache
find . -name "*.tsbuildinfo" -type f -delete 2>/dev/null && echo "  ✓ Removed .tsbuildinfo files" || true

# Remove ESLint cache
find . -name ".eslintcache" -type f -delete 2>/dev/null && echo "  ✓ Removed .eslintcache files" || true

# Remove Jest cache
find . -name ".jest-cache" -type d -prune -exec rm -rf {} + 2>/dev/null && echo "  ✓ Removed .jest-cache directories" || true

echo ""
echo "📦 Standardizing package manager (pnpm)..."

# Remove npm lock file since we're using pnpm
if [ -f "package-lock.json" ]; then
    rm package-lock.json
    echo "  ✓ Removed package-lock.json (using pnpm-lock.yaml)"
fi

echo ""
echo "📊 Cleanup summary:"
du -sh . 2>/dev/null | awk '{print "  Total size: " $1}'
du -sh node_modules 2>/dev/null | awk '{print "  node_modules: " $1}' || echo "  node_modules: not found"

echo ""
echo "✨ Cleanup complete!"
echo ""
echo "Next steps:"
echo "  1. Verify everything works: make docker-up"
echo "  2. Run tests: make test"
echo "  3. If issues occur, reinstall: rm -rf node_modules && pnpm install"
