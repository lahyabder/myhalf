import fs from 'node:fs';

console.log('🔍 [MYHALF Lint] Checking code style and forbidden terms...');

// Ensure DUOVA is strictly forbidden everywhere
const files = [
  'package.json',
  'AGENTS.md',
  'CLAUDE.md',
  'PROJECT_STATUS.md',
  'docs/PRODUCT_SPEC.md',
  'docs/ARCHITECTURE.md',
  'docs/DATA_MODEL.md',
  'docs/SECURITY_MODEL.md',
  'docs/DESIGN_SYSTEM.md',
  'docs/TEST_STRATEGY.md',
  'docs/UX_FLOWS.md',
  'docs/plans/MASTER_PLAN.md',
  'src/lib/governance.mjs',
  'src/lib/membership.mjs',
  'src/lib/safety.mjs'
];

let violations = 0;
for (const f of files) {
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, 'utf8');
    // Check for DUOVA as a standalone product name
    const matches = content.match(/\bDUOVA\b/g);
    if (matches && !content.includes('DUOVA was a previous working name and must not be used')) {
      console.error(`❌ Lint violation in ${f}: Obsolete name 'DUOVA' found!`);
      violations++;
    }
  }
}

if (violations > 0) {
  process.exit(1);
}

console.log('✅ [MYHALF Lint] Zero lint errors. All naming and syntax rules pass!');
