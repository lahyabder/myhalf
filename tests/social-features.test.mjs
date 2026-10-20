import test from 'node:test';
import assert from 'node:assert/strict';
import {
  attributeChatMessage,
  calculateDuoMilestones,
  formatShareCardPayload,
} from '../src/lib/social-features.mjs';

test('Social Features — Attributes chat message to individual co-owner voice', () => {
  const duoMembers = [
    { userId: 'user-1', name: 'سارة', avatar: 'sara.jpg' },
    { userId: 'user-2', name: 'عمر', avatar: 'omar.jpg' },
  ];

  const message = attributeChatMessage({
    duoId: 'duo-123',
    senderUserId: 'user-1',
    duoMembers,
    voiceType: 'INDIVIDUAL',
    text: 'أهلاً بكم! سارة تتحدث هنا.',
  });

  assert.equal(message.voiceType, 'INDIVIDUAL');
  assert.equal(message.authorName, 'سارة');
  assert.equal(message.isDuoVoice, false);
});

test('Social Features — Attributes chat message to unified duo voice', () => {
  const duoMembers = [
    { userId: 'user-1', name: 'سارة', avatar: 'sara.jpg' },
    { userId: 'user-2', name: 'عمر', avatar: 'omar.jpg' },
  ];

  const message = attributeChatMessage({
    duoId: 'duo-123',
    senderUserId: 'user-2',
    duoMembers,
    voiceType: 'UNIFIED',
    text: 'تحياتنا لكما من حساب سارة وعمر معاً!',
  });

  assert.equal(message.voiceType, 'UNIFIED');
  assert.equal(message.authorName, 'سارة وعمر');
  assert.equal(message.isDuoVoice, true);
});

test('Social Features — Rejects message from non-member sender', () => {
  const duoMembers = [
    { userId: 'user-1', name: 'سارة' },
    { userId: 'user-2', name: 'عمر' },
  ];

  assert.throws(
    () => attributeChatMessage({
      duoId: 'duo-123',
      senderUserId: 'outsider-user',
      duoMembers,
      voiceType: 'INDIVIDUAL',
      text: 'مرحباً',
    }),
    /only an active co-owner can send messages on behalf of this duo/i
  );
});

test('Social Features — Calculates duo milestones correctly', () => {
  const duoStats = {
    joinedAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(), // 100 days ago
    postsCount: 25,
    followersCount: 1200,
  };

  const milestones = calculateDuoMilestones(duoStats);
  assert.ok(Array.isArray(milestones));
  assert.ok(milestones.length >= 4);

  // 100 days milestone should be unlocked
  const dayMilestone = milestones.find(m => m.id === '100_days');
  assert.ok(dayMilestone);
  assert.equal(dayMilestone.isUnlocked, true);

  // 1000 followers milestone should be unlocked
  const followersMilestone = milestones.find(m => m.id === '1k_followers');
  assert.ok(followersMilestone);
  assert.equal(followersMilestone.isUnlocked, true);

  // 1-year anniversary should still be locked
  const yearMilestone = milestones.find(m => m.id === '1_year');
  assert.ok(yearMilestone);
  assert.equal(yearMilestone.isUnlocked, false);
});

test('Social Features — Formats viral share card payload with both partner identities', () => {
  const duo = {
    handle: 'sara_and_omar',
    displayName: 'سارة وعمر',
    archetype: 'creative',
    avatar1: 'sara.jpg',
    avatar2: 'omar.jpg',
  };

  const card = formatShareCardPayload(duo);
  assert.equal(card.handle, '@sara_and_omar');
  assert.equal(card.title, 'سارة وعمر');
  assert.equal(card.tagline, 'Two people. One account. Equal ownership.');
  assert.ok(card.qrUrl.includes('sara_and_omar'));
});
