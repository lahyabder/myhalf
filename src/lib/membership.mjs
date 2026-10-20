/**
 * Asserts that a duo account meets the mandatory equal-ownership invariant:
 * Exactly two distinct, verified human owners.
 */
export function assertValidDuoActivation(members) {
  if (!Array.isArray(members) || members.length !== 2) {
    throw new Error('Every active duo must have exactly two distinct verified owners.');
  }

  const [owner1, owner2] = members;
  if (!owner1.userId || !owner2.userId || owner1.userId === owner2.userId) {
    throw new Error('Owners must be distinct individuals.');
  }

  if (owner1.status !== 'ACTIVE' || owner2.status !== 'ACTIVE') {
    throw new Error('Both owners must have completed verification and hold ACTIVE status.');
  }

  return true;
}

/**
 * Asserts that neither owner can unilaterally evict, substitute, or disenfranchise the other.
 */
export function assertDisallowUnilateralEviction({ actorUserId, targetUserId, isDualApproved }) {
  if (actorUserId !== targetUserId && !isDualApproved) {
    throw new Error('Neither owner can unilaterally remove or replace the other. Dual approval is strictly required.');
  }
  return true;
}
