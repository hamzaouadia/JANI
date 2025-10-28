#!/bin/bash
# JANI Project Cleanup Script
# Removes unused files, duplicate documentation, and cleans up the codebase

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════╗"
echo "║         JANI Project Cleanup                           ║"
echo "║         Removing unused files and data                 ║"
echo "╚════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Create backup
echo -e "${YELLOW}📦 Creating backup before cleanup...${NC}"
timestamp=$(date +%Y%m%d_%H%M%S)
backup_dir="../JANI_backup_cleanup_$timestamp"
cp -r . "$backup_dir"
echo -e "${GREEN}✅ Backup created at: $backup_dir${NC}"
echo ""

# Array to track what was deleted
declare -a deleted_files=()
declare -a kept_files=()

# Function to delete file safely
safe_delete() {
    local file="$1"
    local reason="$2"
    
    if [ -f "$file" ] || [ -d "$file" ]; then
        echo -e "${YELLOW}  Removing: $file${NC}"
        echo -e "    Reason: $reason"
        rm -rf "$file"
        deleted_files+=("$file - $reason")
    fi
}

echo -e "${BLUE}🧹 Starting cleanup...${NC}"
echo ""

# 1. Remove duplicate/old Makefiles
echo -e "${BLUE}1. Cleaning up duplicate Makefiles...${NC}"
if [ -f "Makefile.new" ]; then
    if [ -f "Makefile" ]; then
        # Compare and decide
        if diff -q Makefile Makefile.new > /dev/null 2>&1; then
            safe_delete "Makefile.new" "Duplicate of Makefile"
        else
            echo -e "${YELLOW}  Both Makefile and Makefile.new exist and differ${NC}"
            echo -e "  Keeping Makefile.new as it has more features"
            mv Makefile Makefile.old
            mv Makefile.new Makefile
            safe_delete "Makefile.old" "Old version replaced by Makefile.new"
        fi
    else
        mv Makefile.new Makefile
        echo -e "${GREEN}  ✅ Renamed Makefile.new to Makefile${NC}"
    fi
fi
echo ""

# 2. Remove excessive documentation files
echo -e "${BLUE}2. Consolidating documentation...${NC}"

# Keep essential docs, remove duplicates/outdated ones
essential_docs=(
    "README.md"
    "SETUP.md"
    "FIXES_APPLIED.md"
    "QUICKREF.md"
)

# Docs to potentially remove (review first)
docs_to_review=(
    "ENHANCED_DASHBOARD_USAGE.md"
    "jani-ai-project-blueprint.md"
    "jani-ai-ux-design.md"
    "NEXT_WORK_PLAN.md"
    "PROJECT_DOCUMENTATION.md"
    "SEARCH_FIXES_SUMMARY.md"
    "traceability_mobile_app_doc.md"
    "WARP.md"
)

# Move non-essential docs to a docs folder
if [ ! -d "docs" ]; then
    mkdir -p docs
    echo -e "${GREEN}  ✅ Created docs/ directory${NC}"
fi

for doc in "${docs_to_review[@]}"; do
    if [ -f "$doc" ]; then
        mv "$doc" "docs/$doc"
        echo -e "${YELLOW}  Moved: $doc -> docs/$doc${NC}"
        deleted_files+=("$doc - Moved to docs/")
    fi
done
echo ""

# 3. Clean up unused auth/middleware files
echo -e "${BLUE}3. Cleaning up unused auth files...${NC}"

# The old auth file in libs is no longer needed after our fixes
if [ -f "apps/web/libs/auth/verifyToken.ts" ]; then
    safe_delete "apps/web/libs/auth/verifyToken.ts" "Replaced by API routes"
fi

# Remove old auth middleware if it exists
if [ -d "apps/web/libs/auth" ]; then
    if [ -z "$(ls -A apps/web/libs/auth)" ]; then
        safe_delete "apps/web/libs/auth" "Empty directory"
    fi
fi
echo ""

# 4. Remove unused services placeholders
echo -e "${BLUE}4. Checking service placeholders...${NC}"

# Traceability service seems empty/unused
if [ -d "services/traceability" ]; then
    file_count=$(find services/traceability -type f -name "*.js" -o -name "*.ts" | wc -l)
    if [ "$file_count" -lt 2 ]; then
        echo -e "${YELLOW}  Warning: services/traceability has minimal files${NC}"
        echo -e "    Keeping for now but consider implementing or removing"
    fi
fi
echo ""

# 5. Clean node_modules and build artifacts
echo -e "${BLUE}5. Removing build artifacts and dependencies...${NC}"

# Remove node_modules (can be reinstalled)
echo -e "${YELLOW}  Do you want to remove all node_modules? (y/N)${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    find . -name "node_modules" -type d -prune -exec rm -rf {} + 2>/dev/null || true
    echo -e "${GREEN}  ✅ Removed all node_modules${NC}"
    deleted_files+=("node_modules - Can be reinstalled with pnpm install")
fi

# Remove .next build folders
find apps/web -name ".next" -type d -exec rm -rf {} + 2>/dev/null || true
echo -e "${GREEN}  ✅ Removed Next.js build artifacts${NC}"

# Remove dist folders
find services -name "dist" -type d -exec rm -rf {} + 2>/dev/null || true
echo -e "${GREEN}  ✅ Removed service build artifacts${NC}"
echo ""

# 6. Remove unused component files
echo -e "${BLUE}6. Checking for unused components...${NC}"

# ScrollBarIndicator is used in page.tsx so keep it
# TeamSection has minimal content - could be expanded or removed
if grep -q "TeamSection" apps/web/src/app/page.tsx 2>/dev/null; then
    echo -e "${GREEN}  ✅ TeamSection is in use${NC}"
    kept_files+=("apps/web/src/components/TeamSection.tsx - Used in main page")
else
    echo -e "${YELLOW}  Warning: TeamSection might not be used${NC}"
fi
echo ""

# 7. Clean up lock files
echo -e "${BLUE}7. Checking lock files...${NC}"

# Keep pnpm-lock.yaml at root
# Remove duplicate package-lock.json if pnpm is primary
if [ -f "pnpm-lock.yaml" ] && [ -f "package-lock.json" ]; then
    echo -e "${YELLOW}  Both pnpm-lock.yaml and package-lock.json exist${NC}"
    echo -e "  Recommendation: Use pnpm consistently across project"
    echo -e "  Keeping both for now - you should decide which to use"
fi
echo ""

# 8. Remove empty or template files
echo -e "${BLUE}8. Removing empty/template files...${NC}"

# Check for empty TypeScript/JavaScript files
find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | while read -r file; do
    if [ -f "$file" ]; then
        # Check if file has less than 5 lines (likely empty or just comments)
        lines=$(wc -l < "$file" 2>/dev/null || echo "999")
        if [ "$lines" -lt 5 ] && [[ ! "$file" =~ "node_modules" ]]; then
            content=$(cat "$file" 2>/dev/null)
            # Only delete if truly empty or just imports
            if [ -z "$content" ] || [[ "$content" =~ ^[[:space:]]*$ ]]; then
                safe_delete "$file" "Empty file"
            fi
        fi
    fi
done
echo ""

# 9. Remove unused Docker artifacts
echo -e "${BLUE}9. Docker cleanup (optional)...${NC}"
echo -e "${YELLOW}  Do you want to clean Docker resources? (y/N)${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    docker system prune -af --volumes 2>/dev/null || echo "Docker not running or not installed"
    echo -e "${GREEN}  ✅ Docker resources cleaned${NC}"
fi
echo ""

# 10. Create cleanup report
echo -e "${BLUE}10. Generating cleanup report...${NC}"

cat > CLEANUP_REPORT.md << EOF
# JANI Cleanup Report
**Date**: $(date)
**Backup Location**: $backup_dir

## Files Removed/Moved

$(for item in "${deleted_files[@]}"; do echo "- $item"; done)

## Files Kept (Critical)

$(for item in "${kept_files[@]}"; do echo "- $item"; done)

## Recommendations

### 1. Documentation Structure
- Moved non-essential docs to \`docs/\` folder
- Keep: README.md, SETUP.md, FIXES_APPLIED.md, QUICKREF.md

### 2. Lock Files
- Consider standardizing on pnpm across all workspaces
- Remove package-lock.json if using pnpm exclusively

### 3. Services
- \`services/traceability\` - Implement or remove
- \`services/ai\` - Currently just a placeholder
- \`services/user\` - Minimal implementation

### 4. Components to Review
- \`TeamSection\` - Has placeholder content, needs real data
- \`Chatbot\` - Currently fake responses, needs API integration
- \`ScrollBarIndicator\` - Complex implementation, consider simplification

### 5. Middleware Files
- Old auth files removed, now using API routes pattern
- Ensure no imports reference old \`libs/auth/verifyToken\`

### 6. Build Artifacts
- Removed .next, dist, node_modules
- Run \`pnpm install\` to reinstall dependencies

## Next Steps

1. Review moved documentation in \`docs/\` folder
2. Run \`pnpm install\` to reinstall dependencies
3. Test the application: \`make docker-up\`
4. Consider implementing or removing placeholder services
5. Update component content from placeholders to real data

## Disk Space Saved

Run \`du -sh $backup_dir\` to see backup size
Run \`du -sh .\` to see current project size

EOF

echo -e "${GREEN}✅ Cleanup report generated: CLEANUP_REPORT.md${NC}"
echo ""

# Summary
echo -e "${GREEN}"
echo "╔════════════════════════════════════════════════════════╗"
echo "║              Cleanup Complete!                         ║"
echo "╚════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${BLUE}📊 Summary:${NC}"
echo "  • Backup created: $backup_dir"
echo "  • Files processed: ${#deleted_files[@]}"
echo "  • Cleanup report: CLEANUP_REPORT.md"
echo ""
echo -e "${YELLOW}⚠️  Next Steps:${NC}"
echo "  1. Review CLEANUP_REPORT.md"
echo "  2. Run: pnpm install"
echo "  3. Test: make docker-up"
echo "  4. If everything works, delete backup: rm -rf $backup_dir"
echo ""
echo -e "${GREEN}✨ Your project is now cleaner!${NC}"
