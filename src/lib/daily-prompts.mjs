/**
 * Initializes a new Daily Prompt for a duo account.
 */
export function initDailyPrompt({ duoId, questionText, date }) {
  return {
    id: `prompt-${duoId}-${date}`,
    duoId,
    date,
    questionText,
    status: 'PENDING_BOTH',
    isRevealed: false,
    answers: {
      owner1: null,
      owner2: null,
    },
    answeredUserIds: [],
    revealedAt: null,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Submits an answer from one of the co-owners.
 * If both co-owners have now answered, the prompt transitions to REVEALED!
 */
export function submitPromptAnswer({ prompt, senderUserId, ownerSlot, answerText }) {
  const updatedAnswers = { ...prompt.answers };
  const slotKey = ownerSlot === 1 ? 'owner1' : 'owner2';
  
  updatedAnswers[slotKey] = {
    userId: senderUserId,
    text: answerText.trim(),
    submittedAt: new Date().toISOString(),
  };

  const hasOwner1 = !!updatedAnswers.owner1;
  const hasOwner2 = !!updatedAnswers.owner2;
  const bothAnswered = hasOwner1 && hasOwner2;

  let newStatus = prompt.status;
  if (bothAnswered) {
    newStatus = 'REVEALED';
  } else if (hasOwner1) {
    newStatus = 'PENDING_OWNER_2';
  } else if (hasOwner2) {
    newStatus = 'PENDING_OWNER_1';
  }

  const answeredIds = [...new Set([...prompt.answeredUserIds, senderUserId])];

  return {
    ...prompt,
    answers: updatedAnswers,
    status: newStatus,
    isRevealed: bothAnswered,
    answeredUserIds: answeredIds,
    revealedAt: bothAnswered ? new Date().toISOString() : null,
  };
}

/**
 * Enforces the Blind Privacy rule:
 * Co-owner cannot read the other partner's answer until they have submitted their own!
 */
export function getPromptViewForUser(prompt, currentUserId) {
  const isOwner1 = prompt.answers.owner1?.userId === currentUserId;
  const myAnswerObj = isOwner1 ? prompt.answers.owner1 : prompt.answers.owner2;
  const partnerAnswerObj = isOwner1 ? prompt.answers.owner2 : prompt.answers.owner1;

  const partnerHasAnswered = !!partnerAnswerObj;

  return {
    id: prompt.id,
    questionText: prompt.questionText,
    date: prompt.date,
    status: prompt.status,
    isRevealed: prompt.isRevealed,
    myAnswer: myAnswerObj ? myAnswerObj.text : null,
    partnerHasAnswered,
    // CRITICAL BLIND PRIVACY RULE: Partner answer is visible ONLY if prompt is REVEALED
    partnerAnswer: prompt.isRevealed && partnerAnswerObj ? partnerAnswerObj.text : null,
  };
}

/**
 * Increments the Duo Flame streak upon prompt completion.
 */
export function updateDuoStreak(currentStreak, todayDate) {
  const streakDays = currentStreak.streakDays || 0;
  return {
    streakDays: streakDays + 1,
    lastCompletedDate: todayDate,
    isStreakActiveToday: true,
  };
}
