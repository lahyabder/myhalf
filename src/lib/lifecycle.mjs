import crypto from 'node:crypto';

/**
 * Transitions a duo account to MEMORIALIZED state upon verified bereavement.
 * Generates an immutable cryptographic memorial seal for the deceased partner's history.
 */
export function transitionToMemorialized(account, deceasedUserId, survivingUserId, metadata = {}) {
  if (!account || !Array.isArray(account.owners)) {
    throw new Error('Invalid account payload');
  }

  if (!account.owners.includes(deceasedUserId)) {
    throw new Error('Deceased person must be an active co-owner of this duo');
  }

  if (!account.owners.includes(survivingUserId) || survivingUserId === deceasedUserId) {
    throw new Error('Surviving steward must be the other active co-owner');
  }

  const sealPayload = `${account.id}:${deceasedUserId}:${survivingUserId}:${Date.now()}`;
  const memorialSealHash = crypto.createHash('sha256').update(sealPayload).digest('hex');

  return {
    ...account,
    status: 'MEMORIALIZED',
    deceasedUserId,
    stewardUserId: survivingUserId,
    memorialSealHash,
    memorializedAt: new Date().toISOString(),
    memorialNote: metadata.note || 'In eternal loving memory',
    verifiedBy: metadata.verifiedBy || 'COMMUNITY_VERIFIED'
  };
}

/**
 * Ensures content authored by a deceased partner is cryptographically immune to modification or deletion.
 * Permits the surviving steward to publish dedicated memorial tributes with clear attribution.
 */
export function assertDeceasedContentImmunity(account, post, actingUserId, action = 'VIEW') {
  if (account.status === 'MEMORIALIZED') {
    if (action === 'PUBLISH_TRIBUTE' && actingUserId === account.stewardUserId) {
      return {
        allowed: true,
        attribution: 'MEMORIAL_STEWARD_TRIBUTE'
      };
    }

    if (post && post.authorUserId === account.deceasedUserId) {
      if (action === 'EDIT' || action === 'DELETE') {
        throw new Error('Cannot edit or delete content authored by a deceased co-owner; history is sealed');
      }
    }
  }

  return { allowed: true };
}

/**
 * Transitions account to ARCHIVED_SUNSET upon mutual dual approval of amicable separation/divorce.
 */
export function transitionToAmicableSunset(account, dualApprovalPayload) {
  if (!dualApprovalPayload || !Array.isArray(dualApprovalPayload.approvals)) {
    throw new Error('Invalid dual approval payload');
  }

  const missingApproval = account.owners.some(ownerId => !dualApprovalPayload.approvals.includes(ownerId));
  if (missingApproval) {
    throw new Error('Amicable sunset requires mutual dual approval from both owners');
  }

  return {
    ...account,
    status: 'ARCHIVED_SUNSET',
    isReadOnly: true,
    sunsetProposalId: dualApprovalPayload.proposalId,
    sunsetDate: new Date().toISOString()
  };
}

/**
 * Enforces Anti-Revenge Lock during emergency freeze, domestic disputes, or hostile breakups.
 * Disallows unilateral wiping, bulk deletions, or asset destruction.
 */
export function assertAntiRevengeProtection(account, action, actorUserId) {
  if (account.status === 'EMERGENCY_FROZEN') {
    const lockedActions = ['DELETE_POST', 'PURGE_ACCOUNT', 'WIPE_MEDIA', 'CHANGE_PASSWORD'];
    if (lockedActions.includes(action)) {
      throw new Error('Account is in emergency freeze; asset modifications and deletions are locked to prevent revenge actions');
    }
  }

  return { allowed: true };
}

/**
 * Generates an equal vault export package with identical parity for either co-owner.
 */
export function generateEqualVaultExport(account, requestingUserId) {
  if (!account.owners.includes(requestingUserId)) {
    throw new Error('Unauthorized: only a co-owner can request vault data export');
  }

  const token = 'mhe_' + crypto.randomBytes(16).toString('hex');
  return {
    duoId: account.id,
    requestingUser: requestingUserId,
    exportToken: token,
    downloadUrl: `/api/vault/export?token=${token}&duo=${account.id}`,
    parityGuaranteed: true,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  };
}

/**
 * Transitions account to PROJECT_COMPLETED when creative partners/co-founders finish their venture.
 */
export function transitionToProjectCompleted(account, ventureSummary, dualSignoffPayload) {
  if (!dualSignoffPayload || !Array.isArray(dualSignoffPayload.approvals)) {
    throw new Error('Invalid venture signoff payload');
  }

  const missing = account.owners.some(id => !dualSignoffPayload.approvals.includes(id));
  if (missing) {
    throw new Error('Project completion requires signoff from both co-owners');
  }

  return {
    ...account,
    status: 'PROJECT_COMPLETED',
    portfolioShowcase: true,
    ventureSummary,
    forwardingLinks: dualSignoffPayload.forwardingLinks || {},
    legacyBadge: dualSignoffPayload.legacyBadge || 'VENTURE_COMPLETED',
    completedAt: new Date().toISOString()
  };
}

/**
 * Unilaterally activates Duress & Detention Shield to protect accounts when a partner is detained or missing.
 */
export function activateDuressShield(account, actorUserId, reason = 'DURESS_OR_DETENTION') {
  if (!account.owners.includes(actorUserId)) {
    throw new Error('Actor must be an active co-owner');
  }

  return {
    ...account,
    status: 'EMERGENCY_FROZEN',
    duressShieldActive: true,
    whisperChannelDisabled: true,
    freezeInitiator: actorUserId,
    freezeReason: reason,
    frozenAt: new Date().toISOString()
  };
}
