import test from 'node:test';
import assert from 'node:assert/strict';
import { assertValidDuoActivation, assertDisallowUnilateralEviction } from '../src/lib/membership.mjs';

test('Membership — Rejects activation with fewer than 2 owners', () => {
  const members = [{ userId: 'user-1', status: 'ACTIVE' }];
  assert.throws(
    () => assertValidDuoActivation(members),
    /every active duo must have exactly two distinct verified owners/i
  );
});

test('Membership — Rejects activation with more than 2 owners', () => {
  const members = [
    { userId: 'user-1', status: 'ACTIVE' },
    { userId: 'user-2', status: 'ACTIVE' },
    { userId: 'user-3', status: 'ACTIVE' },
  ];
  assert.throws(
    () => assertValidDuoActivation(members),
    /every active duo must have exactly two distinct verified owners/i
  );
});

test('Membership — Rejects activation with identical user in both slots', () => {
  const members = [
    { userId: 'user-1', status: 'ACTIVE' },
    { userId: 'user-1', status: 'ACTIVE' },
  ];
  assert.throws(
    () => assertValidDuoActivation(members),
    /owners must be distinct individuals/i
  );
});

test('Membership — Successfully validates duo with exactly 2 distinct active owners', () => {
  const members = [
    { userId: 'user-1', status: 'ACTIVE' },
    { userId: 'user-2', status: 'ACTIVE' },
  ];
  const isValid = assertValidDuoActivation(members);
  assert.equal(isValid, true);
});

test('Membership — Prevents unilateral removal of a co-owner', () => {
  const actorUserId = 'user-1';
  const targetUserId = 'user-2';

  assert.throws(
    () => assertDisallowUnilateralEviction({ actorUserId, targetUserId, isDualApproved: false }),
    /neither owner can unilaterally remove or replace the other/i
  );
});

test('Membership — Allows mutual disbanding only when dual approved', () => {
  const actorUserId = 'user-1';
  const targetUserId = 'user-2';

  const result = assertDisallowUnilateralEviction({ actorUserId, targetUserId, isDualApproved: true });
  assert.equal(result, true);
});
