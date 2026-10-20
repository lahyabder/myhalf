import crypto from 'node:crypto';

/**
 * Deterministically generates a SHA-256 hash for an immutable governance proposal.
 */
export function generateProposalHash({ duoId, proposalType, payload, nonce }) {
  const canonicalPayload = JSON.stringify(payload, Object.keys(payload).sort());
  const serialized = `${duoId}:${proposalType}:${canonicalPayload}:${nonce}`;
  return crypto.createHash('sha256').update(serialized).digest('hex');
}

/**
 * Validates dual approval for sensitive proposal execution.
 * Enforces:
 * 1. Proposer cannot approve their own proposal.
 * 2. Proposal must not be expired.
 * 3. Payload integrity check (recomputed hash matches proposalHash).
 * 4. Only PENDING proposals can be approved.
 */
export function verifyProposalApproval(proposal, approverUserId) {
  if (proposal.status !== 'PENDING') {
    throw new Error(`Invalid proposal state: ${proposal.status}. Must be PENDING.`);
  }

  if (proposal.proposedByUserId === approverUserId) {
    throw new Error('Proposer cannot approve their own proposal. Dual approval from co-owner is strictly required.');
  }

  const now = new Date();
  const expiry = new Date(proposal.expiresAt);
  if (now > expiry) {
    throw new Error('Proposal has expired and can no longer be approved.');
  }

  const currentHash = generateProposalHash({
    duoId: proposal.duoId,
    proposalType: proposal.proposalType,
    payload: proposal.payload,
    nonce: proposal.nonce,
  });

  if (currentHash !== proposal.proposalHash) {
    throw new Error('Integrity check failed: proposal payload has been modified.');
  }

  return {
    ...proposal,
    status: 'EXECUTED',
    approvedByUserId: approverUserId,
    executedAt: new Date().toISOString(),
  };
}
