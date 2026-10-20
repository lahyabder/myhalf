export const DuoHandleRegex = /^[a-z0-9_]{3,30}$/;

const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateUserRegistration({ email, fullName, password, preferredLocale }) {
  if (!email || !EmailRegex.test(email)) {
    throw new Error('Invalid email address format.');
  }

  if (!fullName || fullName.trim().length < 2) {
    throw new Error('Full name must be at least 2 characters long.');
  }

  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters long.');
  }

  const validLocales = ['ar', 'fr', 'en'];
  if (preferredLocale && !validLocales.includes(preferredLocale)) {
    throw new Error(`Unsupported locale: ${preferredLocale}. Must be one of: ar, fr, en.`);
  }

  return {
    email: email.toLowerCase().trim(),
    fullName: fullName.trim(),
    preferredLocale: preferredLocale || 'en',
  };
}

export function validatePartnerInvitation({ duoId, inviterUserId, inviterEmail, inviteeEmail, proposedDuoName, proposedHandle }) {
  if (!duoId || !inviterUserId) {
    throw new Error('Missing duoId or inviterUserId.');
  }

  if (!inviteeEmail || !EmailRegex.test(inviteeEmail)) {
    throw new Error('Invalid email address format for invitee.');
  }

  if (inviterEmail && inviterEmail.toLowerCase().trim() === inviteeEmail.toLowerCase().trim()) {
    throw new Error('Cannot invite your own email address. Partner must be a distinct person.');
  }

  if (!proposedDuoName || proposedDuoName.trim().length < 2) {
    throw new Error('Proposed duo name must be at least 2 characters.');
  }

  const cleanHandle = (proposedHandle || '').toLowerCase().trim();
  if (!DuoHandleRegex.test(cleanHandle)) {
    throw new Error('Handle must contain only lowercase letters, numbers, and underscores (3-30 characters).');
  }

  return {
    duoId,
    inviterUserId,
    inviteeEmail: inviteeEmail.toLowerCase().trim(),
    proposedDuoName: proposedDuoName.trim(),
    proposedHandle: cleanHandle,
  };
}

export function validateInvitationAcceptance({ token, inviteeUserId, inviteeFullName, agreedToCompact }) {
  if (!token || token.trim().length < 10) {
    throw new Error('Invalid or missing invitation token.');
  }

  if (!inviteeUserId) {
    throw new Error('Missing invitee user ID.');
  }

  if (!inviteeFullName || inviteeFullName.trim().length < 2) {
    throw new Error('Full name is required.');
  }

  if (agreedToCompact !== true) {
    throw new Error('You must agree to the Equal Ownership Compact to activate the duo account.');
  }

  return {
    token: token.trim(),
    inviteeUserId,
    inviteeFullName: inviteeFullName.trim(),
    agreedToCompact: true,
  };
}
