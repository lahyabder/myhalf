import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createPartnerInvitation,
  verifyInvitationToken,
  acceptPartnerInvitation,
  revokePartnerInvitation,
} from '../src/lib/invitations.mjs';

test('Invitations — Generates secure token with cryptographic hash and 7-day expiry', () => {
  const inviter = { userId: 'user-1', email: 'sara@example.com' };
  const duo = { id: 'duo-123', status: 'PENDING_PARTNER', proposedHandle: 'sara_and_omar' };

  const { invitation, plainToken } = createPartnerInvitation({
    duoId: duo.id,
    inviterUserId: inviter.userId,
    inviterEmail: inviter.email,
    inviteeEmail: 'omar@example.com',
  });

  assert.ok(plainToken.startsWith('mhi_'));
  assert.equal(invitation.status, 'PENDING');
  assert.equal(typeof invitation.tokenHash, 'string');
  assert.equal(invitation.tokenHash.length, 64);
  assert.ok(new Date(invitation.expiresAt) > new Date());
});

test('Invitations — Verifies valid pending invitation token', () => {
  const { invitation, plainToken } = createPartnerInvitation({
    duoId: 'duo-123',
    inviterUserId: 'user-1',
    inviterEmail: 'sara@example.com',
    inviteeEmail: 'omar@example.com',
  });

  const verified = verifyInvitationToken(invitation, plainToken);
  assert.equal(verified.status, 'PENDING');
  assert.equal(verified.duoId, 'duo-123');
});

test('Invitations — Rejects expired invitation token', () => {
  const { invitation, plainToken } = createPartnerInvitation({
    duoId: 'duo-123',
    inviterUserId: 'user-1',
    inviterEmail: 'sara@example.com',
    inviteeEmail: 'omar@example.com',
  });
  invitation.expiresAt = new Date(Date.now() - 1000).toISOString(); // Expired

  assert.throws(
    () => verifyInvitationToken(invitation, plainToken),
    /invitation has expired/i
  );
});

test('Invitations — Rejects revoked invitation token', () => {
  const { invitation, plainToken } = createPartnerInvitation({
    duoId: 'duo-123',
    inviterUserId: 'user-1',
    inviterEmail: 'sara@example.com',
    inviteeEmail: 'omar@example.com',
  });
  const revoked = revokePartnerInvitation(invitation, 'user-1');
  assert.equal(revoked.status, 'REVOKED');

  assert.throws(
    () => verifyInvitationToken(revoked, plainToken),
    /invitation is no longer active/i
  );
});

test('Invitations — Accepts invitation and transitions duo account to ACTIVE', () => {
  const duo = { id: 'duo-123', status: 'PENDING_PARTNER' };
  const existingMembers = [{ userId: 'user-1', status: 'ACTIVE' }];
  const { invitation, plainToken } = createPartnerInvitation({
    duoId: duo.id,
    inviterUserId: 'user-1',
    inviterEmail: 'sara@example.com',
    inviteeEmail: 'omar@example.com',
  });

  const result = acceptPartnerInvitation({
    invitation,
    plainToken,
    duo,
    existingMembers,
    inviteeUser: { userId: 'user-2', fullName: 'Omar', agreedToCompact: true },
  });

  assert.equal(result.duo.status, 'ACTIVE');
  assert.equal(result.invitation.status, 'ACCEPTED');
  assert.equal(result.members.length, 2);
  assert.equal(result.members[1].userId, 'user-2');
  assert.equal(result.members[1].status, 'ACTIVE');
});
