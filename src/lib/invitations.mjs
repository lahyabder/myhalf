import crypto from 'node:crypto';
import { assertValidDuoActivation } from './membership.mjs';

function hashToken(plainToken) {
  return crypto.createHash('sha256').update(plainToken).digest('hex');
}

/**
 * Creates a secure partner invitation record with an entropy-rich token and 7-day expiration.
 */
export function createPartnerInvitation({ duoId, inviterUserId, inviterEmail, inviteeEmail }) {
  const randomBytes = crypto.randomBytes(24).toString('hex');
  const plainToken = `mhi_${randomBytes}`;
  const tokenHash = hashToken(plainToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const invitation = {
    id: `inv-${crypto.randomUUID()}`,
    duoId,
    inviterUserId,
    inviterEmail,
    inviteeEmail,
    tokenHash,
    status: 'PENDING',
    expiresAt,
    createdAt: new Date().toISOString(),
  };

  return { invitation, plainToken };
}

/**
 * Validates that an invitation token is unexpired, unrevoked, and matches the stored cryptographic hash.
 */
export function verifyInvitationToken(invitation, plainToken) {
  if (invitation.status !== 'PENDING') {
    throw new Error(`Invitation is no longer active (status: ${invitation.status}).`);
  }

  const now = new Date();
  if (now > new Date(invitation.expiresAt)) {
    throw new Error('This partner invitation has expired.');
  }

  const computedHash = hashToken(plainToken);
  if (computedHash !== invitation.tokenHash) {
    throw new Error('Invalid or corrupted invitation token.');
  }

  return invitation;
}

/**
 * Executes atomic acceptance of a partner invitation:
 * 1. Verifies token and compact consent.
 * 2. Adds second owner.
 * 3. Asserts the 2-owner invariant via assertValidDuoActivation.
 * 4. Activates duo account and marks invitation ACCEPTED.
 */
export function acceptPartnerInvitation({ invitation, plainToken, duo, existingMembers, inviteeUser }) {
  verifyInvitationToken(invitation, plainToken);

  if (!inviteeUser.agreedToCompact) {
    throw new Error('Partner must explicitly agree to the Equal Ownership Compact.');
  }

  const newMember = {
    userId: inviteeUser.userId,
    status: 'ACTIVE',
    ownerSlot: 2,
    joinedAt: new Date().toISOString(),
  };

  const updatedMembers = [...existingMembers, newMember];

  // Invariant verification
  assertValidDuoActivation(updatedMembers);

  return {
    duo: {
      ...duo,
      status: 'ACTIVE',
      verifiedAt: new Date().toISOString(),
    },
    invitation: {
      ...invitation,
      status: 'ACCEPTED',
      acceptedByUserId: inviteeUser.userId,
      acceptedAt: new Date().toISOString(),
    },
    members: updatedMembers,
  };
}

/**
 * Revokes a pending partner invitation by the inviter.
 */
export function revokePartnerInvitation(invitation, actorUserId) {
  if (invitation.inviterUserId !== actorUserId) {
    throw new Error('Only the inviter can revoke this invitation.');
  }

  if (invitation.status !== 'PENDING') {
    throw new Error(`Cannot revoke invitation with status ${invitation.status}.`);
  }

  return {
    ...invitation,
    status: 'REVOKED',
    revokedAt: new Date().toISOString(),
  };
}
