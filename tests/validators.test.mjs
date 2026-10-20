import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateUserRegistration,
  validatePartnerInvitation,
  validateInvitationAcceptance,
  DuoHandleRegex,
} from '../src/lib/validators.mjs';

test('Validators — User Registration accepts valid payload', () => {
  const payload = {
    email: 'sara@example.com',
    fullName: 'سارة المنصوري',
    password: 'SecurePassword123!',
    preferredLocale: 'ar',
  };

  const result = validateUserRegistration(payload);
  assert.equal(result.email, 'sara@example.com');
  assert.equal(result.preferredLocale, 'ar');
});

test('Validators — User Registration rejects invalid email', () => {
  const payload = {
    email: 'not-an-email',
    fullName: 'سارة المنصوري',
    password: 'SecurePassword123!',
    preferredLocale: 'ar',
  };

  assert.throws(
    () => validateUserRegistration(payload),
    /invalid email address/i
  );
});

test('Validators — User Registration rejects short password', () => {
  const payload = {
    email: 'sara@example.com',
    fullName: 'سارة',
    password: '123',
    preferredLocale: 'ar',
  };

  assert.throws(
    () => validateUserRegistration(payload),
    /password must be at least 8 characters/i
  );
});

test('Validators — Partner Invitation accepts valid payload', () => {
  const payload = {
    duoId: '550e8400-e29b-41d4-a716-446655440000',
    inviterUserId: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    inviterEmail: 'sara@example.com',
    inviteeEmail: 'omar@example.com',
    proposedDuoName: 'سارة وعمر',
    proposedHandle: 'sara_and_omar',
  };

  const result = validatePartnerInvitation(payload);
  assert.equal(result.proposedHandle, 'sara_and_omar');
});

test('Validators — Partner Invitation rejects invalid handle format', () => {
  const payload = {
    duoId: '550e8400-e29b-41d4-a716-446655440000',
    inviterUserId: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    inviterEmail: 'sara@example.com',
    inviteeEmail: 'omar@example.com',
    proposedDuoName: 'سارة وعمر',
    proposedHandle: 'Sara & Omar!', // Invalid characters
  };

  assert.throws(
    () => validatePartnerInvitation(payload),
    /handle must contain only lowercase letters, numbers, and underscores/i
  );
});

test('Validators — Partner Invitation rejects self-invitation', () => {
  const payload = {
    duoId: '550e8400-e29b-41d4-a716-446655440000',
    inviterUserId: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    inviterEmail: 'sara@example.com',
    inviteeEmail: 'sara@example.com', // Self invite
    proposedDuoName: 'سارة وعمر',
    proposedHandle: 'sara_and_omar',
  };

  assert.throws(
    () => validatePartnerInvitation(payload),
    /cannot invite your own email address/i
  );
});

test('Validators — Invitation Acceptance requires explicit Compact agreement', () => {
  const payload = {
    token: 'token_1234567890abcdef',
    inviteeUserId: '7ca7b810-9dad-11d1-80b4-00c04fd430c9',
    inviteeFullName: 'عمر التلمودي',
    agreedToCompact: false, // Refused agreement
  };

  assert.throws(
    () => validateInvitationAcceptance(payload),
    /must agree to the equal ownership compact/i
  );
});

test('Validators — Invitation Acceptance succeeds when Compact is accepted', () => {
  const payload = {
    token: 'token_1234567890abcdef',
    inviteeUserId: '7ca7b810-9dad-11d1-80b4-00c04fd430c9',
    inviteeFullName: 'عمر التلمودي',
    agreedToCompact: true,
  };

  const result = validateInvitationAcceptance(payload);
  assert.equal(result.agreedToCompact, true);
});
