import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateProposalHash, verifyProposalApproval } from './src/lib/governance.mjs';
import { assertValidDuoActivation, assertDisallowUnilateralEviction } from './src/lib/membership.mjs';
import { executeEmergencySafetyFreeze, filterConfidentialSafetyRecords, assertPostingAllowed } from './src/lib/safety.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 4650;

// Serve HTML app
function getHtmlApp() {
  const htmlPath = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(htmlPath)) {
    return fs.readFileSync(htmlPath, 'utf8');
  }
  return '<h1>MYHALF Server Running</h1>';
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health API probe
  if (url.pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      product: 'myhalf',
      slug: 'myhalf',
      version: '0.1.0',
      port: PORT,
      invariants: {
        ownersPerDuo: 2,
        unilateralEvictionBlocked: true,
        dualApprovalRequiredForSensitiveChanges: true,
        unilateralSafetyFreezeAvailable: true
      },
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // API to compute deterministic proposal hash
  if (url.pathname === '/api/proposals/hash' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const hash = generateProposalHash(payload);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, proposalHash: hash }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // API to verify proposal approval
  if (url.pathname === '/api/proposals/approve' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { proposal, approverUserId } = JSON.parse(body);
        const result = verifyProposalApproval(proposal, approverUserId);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, proposal: result }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // Static files or main SPA
  if (url.pathname.startsWith('/public/')) {
    const filePath = path.join(__dirname, url.pathname);
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath);
      const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.svg': 'image/svg+xml',
        '.png': 'image/png'
      };
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }

  // Fallback to SPA
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(getHtmlApp());
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 [MYHALF] Application running at http://localhost:${PORT}`);
  console.log(`🔒 [MYHALF] Operating on dedicated port ${PORT} (Ports 3000, 5000, 5173, 7000 protected)`);
});
