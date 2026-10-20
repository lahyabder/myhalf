import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  transitionToMemorialized,
  assertDeceasedContentImmunity,
  transitionToAmicableSunset,
  assertAntiRevengeProtection,
  generateEqualVaultExport,
  transitionToProjectCompleted,
  activateDuressShield
} from '../src/lib/lifecycle.mjs';

const mockDuoAccount = {
  id: 'duo_abc_123',
  handle: 'sara_and_omar',
  status: 'ACTIVE',
  owners: ['usr_omar_1', 'usr_sara_2'],
  createdAt: '2026-01-15T10:00:00Z'
};

test('Lifecycle — Transitions to MEMORIALIZED and seals deceased history', () => {
  const result = transitionToMemorialized(mockDuoAccount, 'usr_sara_2', 'usr_omar_1', {
    verifiedBy: 'LEGAL_CERTIFICATE_OR_TRUSTED_CONTACT',
    note: 'In loving memory of Sara'
  });

  assert.equal(result.status, 'MEMORIALIZED');
  assert.equal(result.deceasedUserId, 'usr_sara_2');
  assert.equal(result.stewardUserId, 'usr_omar_1');
  assert.ok(result.memorialSealHash, 'Cryptographic memorial seal hash must be generated');
  assert.equal(typeof result.memorialSealHash, 'string');
});

test('Lifecycle — Rejects memorialization if deceased is not a duo co-owner', () => {
  assert.throws(
    () => transitionToMemorialized(mockDuoAccount, 'usr_stranger_9', 'usr_omar_1'),
    /Deceased person must be an active co-owner of this duo/
  );
});

test('Lifecycle — Deceased content immunity blocks alteration by anyone, including the steward', () => {
  const memorializedDuo = {
    ...mockDuoAccount,
    status: 'MEMORIALIZED',
    deceasedUserId: 'usr_sara_2',
    stewardUserId: 'usr_omar_1'
  };

  const deceasedPost = {
    id: 'post_001',
    authorUserId: 'usr_sara_2',
    caption: 'Sunset in Nouakchott'
  };

  // Attempt to edit deceased post by surviving partner
  assert.throws(
    () => assertDeceasedContentImmunity(memorializedDuo, deceasedPost, 'usr_omar_1', 'EDIT'),
    /Cannot edit or delete content authored by a deceased co-owner/
  );
});

test('Lifecycle — Surviving steward can publish memorial tributes with clear attribution', () => {
  const memorializedDuo = {
    ...mockDuoAccount,
    status: 'MEMORIALIZED',
    deceasedUserId: 'usr_sara_2',
    stewardUserId: 'usr_omar_1'
  };

  const tributePost = {
    authorUserId: 'usr_omar_1',
    isMemorialTribute: true,
    caption: 'Remembering our anniversary today'
  };

  const validated = assertDeceasedContentImmunity(memorializedDuo, tributePost, 'usr_omar_1', 'PUBLISH_TRIBUTE');
  assert.equal(validated.allowed, true);
  assert.equal(validated.attribution, 'MEMORIAL_STEWARD_TRIBUTE');
});

test('Lifecycle — Transitions to ARCHIVED_SUNSET when both owners dual-approve amicable separation', () => {
  const dualApproval = {
    proposalId: 'prop_sunset_99',
    type: 'AMICABLE_SUNSET',
    approvals: ['usr_omar_1', 'usr_sara_2']
  };

  const sunset = transitionToAmicableSunset(mockDuoAccount, dualApproval);
  assert.equal(sunset.status, 'ARCHIVED_SUNSET');
  assert.equal(sunset.isReadOnly, true);
  assert.ok(sunset.sunsetDate);
});

test('Lifecycle — Rejects amicable separation without dual mutual approval', () => {
  const unilateralAttempt = {
    proposalId: 'prop_sunset_99',
    type: 'AMICABLE_SUNSET',
    approvals: ['usr_omar_1'] // Missing Sara
  };

  assert.throws(
    () => transitionToAmicableSunset(mockDuoAccount, unilateralAttempt),
    /Amicable sunset requires mutual dual approval from both owners/
  );
});

test('Lifecycle — Anti-Revenge Lock blocks unilateral asset deletion during emergency freeze or dispute', () => {
  const frozenAccount = {
    ...mockDuoAccount,
    status: 'EMERGENCY_FROZEN',
    freezeInitiator: 'usr_sara_2',
    freezeReason: 'DOMESTIC_DISPUTE'
  };

  assert.throws(
    () => assertAntiRevengeProtection(frozenAccount, 'DELETE_POST', 'usr_omar_1'),
    /Account is in emergency freeze; asset modifications and deletions are locked/
  );
});

test('Lifecycle — Generates equal vault export package for requesting co-owner with mutual parity', () => {
  const exportPackage = generateEqualVaultExport(mockDuoAccount, 'usr_omar_1');

  assert.equal(exportPackage.duoId, mockDuoAccount.id);
  assert.equal(exportPackage.requestingUser, 'usr_omar_1');
  assert.equal(exportPackage.parityGuaranteed, true);
  assert.ok(exportPackage.exportToken.startsWith('mhe_'));
  assert.ok(exportPackage.downloadUrl.includes('export'));
});

test('Lifecycle — Transitions to PROJECT_COMPLETED for creative/startup co-founders with dual signoff', () => {
  const ventureSignoff = {
    approvals: ['usr_omar_1', 'usr_sara_2'],
    legacyBadge: 'FOUNDERS_HALL_OF_FAME',
    forwardingLinks: {
      usr_omar_1: '@omar_next_venture',
      usr_sara_2: '@sara_design_studio'
    }
  };

  const completed = transitionToProjectCompleted(mockDuoAccount, 'Podcast Series Season 1-3 Completed', ventureSignoff);
  assert.equal(completed.status, 'PROJECT_COMPLETED');
  assert.equal(completed.portfolioShowcase, true);
  assert.equal(completed.forwardingLinks.usr_omar_1, '@omar_next_venture');
});

test('Lifecycle — Activates Duress & Detention Shield unilaterally to protect missing/coerced partner', () => {
  const duressShield = activateDuressShield(mockDuoAccount, 'usr_omar_1', 'PARTNER_DETAINED_OR_MISSING');

  assert.equal(duressShield.status, 'EMERGENCY_FROZEN');
  assert.equal(duressShield.duressShieldActive, true);
  assert.equal(duressShield.whisperChannelDisabled, true);
});
