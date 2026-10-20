import test from 'node:test';
import assert from 'node:assert/strict';
import {
  executeEmergencySafetyFreeze,
  filterConfidentialSafetyRecords,
  assertPostingAllowed,
} from '../src/lib/safety.mjs';

test('Safety — Co-owner can unilaterally trigger emergency freeze', () => {
  const duo = { id: 'duo-123', status: 'ACTIVE' };
  const member = { userId: 'user-1', duoId: 'duo-123' };

  const frozenDuo = executeEmergencySafetyFreeze(duo, member.userId, 'Suspected unauthorized access');
  assert.equal(frozenDuo.status, 'FROZEN');
  assert.equal(frozenDuo.frozenByUserId, 'user-1');
  assert.ok(frozenDuo.frozenAt);
});

test('Safety — Rejects emergency freeze from non-member', () => {
  const duo = { id: 'duo-123', status: 'ACTIVE' };
  const outsiderId = 'malicious-outsider';

  assert.throws(
    () => executeEmergencySafetyFreeze(duo, outsiderId, 'Trolling', ['user-1', 'user-2']),
    /only an active co-owner can trigger an emergency safety freeze/i
  );
});

test('Safety — Confidential abuse reports are invisible to co-owner', () => {
  const records = [
    { id: 'rep-1', triggeredByUserId: 'user-1', isConfidential: true, reason: 'Coercive behavior' },
    { id: 'log-1', triggeredByUserId: 'user-1', isConfidential: false, reason: 'Profile banner updated' },
  ];

  // User 2 queries safety records
  const visibleToUser2 = filterConfidentialSafetyRecords(records, 'user-2');
  assert.equal(visibleToUser2.length, 1);
  assert.equal(visibleToUser2[0].id, 'log-1');

  // User 1 queries safety records
  const visibleToUser1 = filterConfidentialSafetyRecords(records, 'user-1');
  assert.equal(visibleToUser1.length, 2);
});

test('Safety — Blocks posting and interactions when account is FROZEN', () => {
  const frozenDuo = { id: 'duo-123', status: 'FROZEN' };

  assert.throws(
    () => assertPostingAllowed(frozenDuo),
    /account is currently frozen for safety/i
  );
});
