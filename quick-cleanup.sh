#!/bin/bash
# Quick and safe cleanup - removes only obvious unused files

set -e

echo "🧹 Starting quick cleanup..."
echo ""

# Create docs directory
mkdir -p docs

# Move documentation files
echo "📚 Moving documentation to docs/..."
[ -f "ENHANCED_DASHBOARD_USAGE.md" ] && mv "ENHANCED_DASHBOARD_USAGE.md" "docs/" && echo "  ✓ Moved ENHANCED_DASHBOARD_USAGE.md"
[ -f "jani-ai-project-blueprint.md" ] && mv "jani-ai-project-blueprint.md" "docs/" && echo "  ✓ Moved jani-ai-project-blueprint.md"
[ -f "jani-ai-ux-design.md" ] && mv "jani-ai-ux-design.md" "docs/" && echo "  ✓ Moved jani-ai-ux-design.md"
[ -f "NEXT_WORK_PLAN.md" ] && mv "NEXT_WORK_PLAN.md" "docs/" && echo "  ✓ Moved NEXT_WORK_PLAN.md"
[ -f "PROJECT_DOCUMENTATION.md" ] && mv "PROJECT_DOCUMENTATION.md" "docs/" && echo "  ✓ Moved PROJECT_DOCUMENTATION.md"
[ -f "SEARCH_FIXES_SUMMARY.md" ] && mv "SEARCH_FIXES_SUMMARY.md" "docs/" && echo "  ✓ Moved SEARCH_FIXES_SUMMARY.md"
[ -f "traceability_mobile_app_doc.md" ] && mv "traceability_mobile_app_doc.md" "docs/" && echo "  ✓ Moved traceability_mobile_app_doc.md"
[ -f "WARP.md" ] && mv "WARP.md" "docs/" && echo "  ✓ Moved WARP.md"

echo ""
echo "🔧 Updating Makefile..."
if [ -f "Makefile.new" ]; then
    [ -f "Makefile" ] && mv "Makefile" "Makefile.old"
    mv "Makefile.new" "Makefile"
    echo "  ✓ Replaced Makefile with improved version"
    echo "  ✓ Old Makefile saved as Makefile.old"
fi

echo ""
echo "🗑️  Removing unused auth files..."
if [ -f "apps/web/libs/auth/verifyToken.ts" ]; then
    rm -f "apps/web/libs/auth/verifyToken.ts"
    echo "  ✓ Removed apps/web/libs/auth/verifyToken.ts"
    rmdir "apps/web/libs/auth" 2>/dev/null && echo "  ✓ Removed empty libs/auth directory" || true
fi

echo ""
echo "✨ Quick cleanup complete!"
echo ""
echo "📊 Summary:"
echo "  • Moved 8 documentation files to docs/"
echo "  • Updated Makefile with improved version"
echo "  • Removed unused auth files"
echo ""
echo "Next steps:"
echo "  1. Review changes"
echo "  2. Run: make help (to see new commands)"
echo "  3. Continue working!"

