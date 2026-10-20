/**
 * Executes a unilateral emergency freeze on a duo account.
 * Either verified co-owner can trigger this immediately without partner authorization.
 */
export function executeEmergencySafetyFreeze(duo, actorUserId, reason, validMemberUserIds = null) {
  if (validMemberUserIds && !validMemberUserIds.includes(actorUserId)) {
    throw new Error('Only an active co-owner can trigger an emergency safety freeze.');
  }

  return {
    ...duo,
    status: 'FROZEN',
    frozenByUserId: actorUserId,
    frozenReason: reason,
    frozenAt: new Date().toISOString(),
  };
}

/**
 * Filters safety and abuse records according to Row Level Security rules.
 * Confidential records are visible strictly to the user who triggered them.
 */
export function filterConfidentialSafetyRecords(records, currentUserId) {
  if (!Array.isArray(records)) return [];
  return records.filter(record => {
    if (record.isConfidential) {
      return record.triggeredByUserId === currentUserId;
    }
    return true;
  });
}

/**
 * Asserts that a duo account is in an active state capable of posting or social interactions.
 */
export function assertPostingAllowed(duo) {
  if (duo.status === 'FROZEN') {
    throw new Error('This account is currently frozen for safety reasons. Posting and modifications are suspended.');
  }
  if (duo.status !== 'ACTIVE') {
    throw new Error(`Cannot post while account status is ${duo.status}. Account must be ACTIVE.`);
  }
  return true;
}
