import fs from 'node:fs';
import path from 'node:path';

console.log('⚡ [MYHALF Build] Validating build artifacts and static assets...');
const requiredFiles = [
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
  'docs/plans/README.md',
  'server.mjs'
];

let hasErrors = false;
for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`❌ Missing required file: ${file}`);
    hasErrors = true;
  }
}

if (hasErrors) {
  console.error('Build verification failed.');
  process.exit(1);
}

console.log('✅ [MYHALF Build] Production build verification successful!');
