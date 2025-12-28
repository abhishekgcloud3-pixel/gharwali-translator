#!/usr/bin/env sh
# Pre-commit hook for Garhwali Seva

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "${YELLOW}Running pre-commit checks...${NC}"

# Check if files were modified
if git diff --cached --name-only | grep -E '\.(ts|tsx|js|jsx)$' > /dev/null; then
  echo "${GREEN}✓ TypeScript/JavaScript files detected${NC}"
else
  echo "${YELLOW}No TypeScript/JavaScript files to check${NC}"
  exit 0
fi

# Run lint
echo "Running ESLint..."
npx eslint --quiet --cache --cache-location .eslintcache --color . 2>/dev/null
if [ $? -ne 0 ]; then
  echo "${RED}✗ ESLint failed${NC}"
  exit 1
fi
echo "${GREEN}✓ ESLint passed${NC}"

# Run type check
echo "Running TypeScript type check..."
npx tsc --noEmit --skipLibCheck 2>/dev/null
if [ $? -ne 0 ]; then
  echo "${RED}✗ TypeScript check failed${NC}"
  exit 1
fi
echo "${GREEN}✓ TypeScript check passed${NC}"

# Check for console.log statements
echo "Checking for console.log statements..."
if git diff --cached --name-only | xargs grep -l 'console\.log' | grep -v '\.test\.(ts|tsx|js|jsx)$' > /dev/null 2>&1; then
  echo "${YELLOW}⚠ Console.log statements detected (excluding test files)${NC}"
fi

# Check dictionary JSON is valid
echo "Validating dictionary..."
node -e "
const dict = require('./lib/garhwali_dictionary.json');
if (!Array.isArray(dict)) {
  console.error('Dictionary must be an array');
  process.exit(1);
}
const invalid = dict.filter(e => !e.garhwali_word || !e.hindi_meaning || !e.english_meaning || !e.category);
if (invalid.length > 0) {
  console.error('Invalid dictionary entries found:', invalid.length);
  process.exit(1);
}
console.log('✓ Dictionary valid (' + dict.length + ' entries)');
" 2>/dev/null

echo ""
echo "${GREEN}All pre-commit checks passed!${NC}"
exit 0
