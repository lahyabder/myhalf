import test from 'node:test';
import assert from 'node:assert/strict';
import {
  initDailyPrompt,
  submitPromptAnswer,
  getPromptViewForUser,
  updateDuoStreak,
} from '../src/lib/daily-prompts.mjs';

test('Daily Prompt — Initializes prompt with PENDING_BOTH state', () => {
  const prompt = initDailyPrompt({
    duoId: 'duo-123',
    questionText: 'ما هي أجمل ذكرى عفوية جمعتكما هذا الأسبوع؟',
    date: '2026-10-20',
  });

  assert.equal(prompt.status, 'PENDING_BOTH');
  assert.equal(prompt.answers.owner1, null);
  assert.equal(prompt.answers.owner2, null);
  assert.equal(prompt.isRevealed, false);
});

test('Daily Prompt — Hides Partner 1 answer from Partner 2 until Partner 2 answers (Blind Privacy)', () => {
  let prompt = initDailyPrompt({
    duoId: 'duo-123',
    questionText: 'ما هي أجمل ذكرى؟',
    date: '2026-10-20',
  });

  // Partner 1 answers
  prompt = submitPromptAnswer({
    prompt,
    senderUserId: 'user-owner-1',
    ownerSlot: 1,
    answerText: 'عندما جلسنا نشرب الشاي ونشاهد غروب المحيط في نواكشوط.',
  });

  assert.equal(prompt.status, 'PENDING_OWNER_2');

  // Partner 1 looks at prompt: can see their own answer
  const viewForOwner1 = getPromptViewForUser(prompt, 'user-owner-1');
  assert.equal(viewForOwner1.myAnswer, 'عندما جلسنا نشرب الشاي ونشاهد غروب المحيط في نواكشوط.');
  assert.equal(viewForOwner1.partnerHasAnswered, false);

  // Partner 2 looks at prompt: partner's answer MUST be obscured (Blind)
  const viewForOwner2 = getPromptViewForUser(prompt, 'user-owner-2');
  assert.equal(viewForOwner2.myAnswer, null);
  assert.equal(viewForOwner2.partnerHasAnswered, true);
  assert.equal(viewForOwner2.partnerAnswer, null, 'Partner 1 answer must remain strictly hidden!');
});

test('Daily Prompt — Reveals both answers simultaneously once Partner 2 answers', () => {
  let prompt = initDailyPrompt({
    duoId: 'duo-123',
    questionText: 'ما هي أجمل ذكرى؟',
    date: '2026-10-20',
  });

  // Partner 1 answers
  prompt = submitPromptAnswer({
    prompt,
    senderUserId: 'user-owner-1',
    ownerSlot: 1,
    answerText: 'إجابة سارة الخاصة.',
  });

  // Partner 2 answers
  prompt = submitPromptAnswer({
    prompt,
    senderUserId: 'user-owner-2',
    ownerSlot: 2,
    answerText: 'إجابة عمر الخاصة.',
  });

  assert.equal(prompt.status, 'REVEALED');
  assert.equal(prompt.isRevealed, true);

  // Now both can see both answers!
  const viewForOwner1 = getPromptViewForUser(prompt, 'user-owner-1');
  assert.equal(viewForOwner1.isRevealed, true);
  assert.equal(viewForOwner1.partnerAnswer, 'إجابة عمر الخاصة.');

  const viewForOwner2 = getPromptViewForUser(prompt, 'user-owner-2');
  assert.equal(viewForOwner2.isRevealed, true);
  assert.equal(viewForOwner2.partnerAnswer, 'إجابة سارة الخاصة.');
});

test('Daily Prompt — Updates Duo Flame streak when prompt is completed', () => {
  const currentStreak = {
    streakDays: 42,
    lastCompletedDate: '2026-10-19',
  };

  const updated = updateDuoStreak(currentStreak, '2026-10-20');
  assert.equal(updated.streakDays, 43);
  assert.equal(updated.lastCompletedDate, '2026-10-20');
  assert.equal(updated.isStreakActiveToday, true);
});
