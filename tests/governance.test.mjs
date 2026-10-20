import test from 'node:test';
import assert from 'node:assert/strict';
import { generateProposalHash, verifyProposalApproval } from '../src/lib/governance.mjs';

test('Governance — Proposal Hash is deterministic', () => {
  const proposal = {
    duoId: 'duo-123',
    proposalType: 'HANDLE_CHANGE',
    payload: { newHandle: 'pixel_craft' },
    nonce: 'nonce-uuid-abc',
  };

  const hash1 = generateProposalHash(proposal);
  const hash2 = generateProposalHash(proposal);

  assert.equal(typeof hash1, 'string');
  assert.equal(hash1.length, 64, 'SHA-256 hash must be 64 hex characters');
  assert.equal(hash1, hash2, 'Hash must be strictly deterministic');
});

test('Governance — Rejects self-approval by same owner', () => {
  const proposal = {
    id: 'prop-1',
    duoId: 'duo-123',
    proposedByUserId: 'user-owner-1',
    proposalType: 'HANDLE_CHANGE',
    payload: { newHandle: 'pixel_craft' },
    nonce: 'nonce-uuid-abc',
    status: 'PENDING',
    expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
  };
  proposal.proposalHash = generateProposalHash(proposal);

  assert.throws(
    () => verifyProposalApproval(proposal, 'user-owner-1'),
    /cannot approve their own proposal/i
  );
});

test('Governance — Rejects expired proposals', () => {
  const proposal = {
    id: 'prop-2',
    duoId: 'duo-123',
    proposedByUserId: 'user-owner-1',
    proposalType: 'HANDLE_CHANGE',
    payload: { newHandle: 'pixel_craft' },
    nonce: 'nonce-uuid-abc',
    status: 'PENDING',
    expiresAt: new Date(Date.now() - 3600 * 1000).toISOString(), // Expired 1 hour ago
  };
  proposal.proposalHash = generateProposalHash(proposal);

  assert.throws(
    () => verifyProposalApproval(proposal, 'user-owner-2'),
    /proposal has expired/i
  );
});

test('Governance — Rejects tampered payloads', () => {
  const proposal = {
    id: 'prop-3',
    duoId: 'duo-123',
    proposedByUserId: 'user-owner-1',
    proposalType: 'HANDLE_CHANGE',
    payload: { newHandle: 'legit_handle' },
    nonce: 'nonce-uuid-abc',
    status: 'PENDING',
    expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
  };
  proposal.proposalHash = generateProposalHash(proposal);

  // Tamper with payload
  proposal.payload.newHandle = 'hacked_handle';

  assert.throws(
    () => verifyProposalApproval(proposal, 'user-owner-2'),
    /integrity check failed/i
  );
});

test('Governance — Approves valid proposal and transitions to EXECUTED', () => {
  const proposal = {
    id: 'prop-4',
    duoId: 'duo-123',
    proposedByUserId: 'user-owner-1',
    proposalType: 'HANDLE_CHANGE',
    payload: { newHandle: 'sara_and_omar' },
    nonce: 'nonce-uuid-xyz',
    status: 'PENDING',
    expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
  };
  proposal.proposalHash = generateProposalHash(proposal);

  const result = verifyProposalApproval(proposal, 'user-owner-2');
  assert.equal(result.status, 'EXECUTED');
  assert.equal(result.approvedByUserId, 'user-owner-2');
  assert.ok(result.executedAt);
});
