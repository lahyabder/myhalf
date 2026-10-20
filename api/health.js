export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    status: 'ok',
    product: 'myhalf',
    slug: 'myhalf',
    version: '0.1.0',
    domain: 'myhalf.online',
    invariants: {
      ownersPerDuo: 2,
      unilateralEvictionBlocked: true,
      dualApprovalRequiredForSensitiveChanges: true,
      unilateralSafetyFreezeAvailable: true
    },
    timestamp: new Date().toISOString()
  });
}
