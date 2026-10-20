/**
 * Attributes a chat message to either an individual co-owner or the unified duo account.
 */
export function attributeChatMessage({ duoId, senderUserId, duoMembers, voiceType, text }) {
  const member = duoMembers.find(m => m.userId === senderUserId);
  if (!member) {
    throw new Error('Only an active co-owner can send messages on behalf of this duo.');
  }

  const isDuoVoice = voiceType === 'UNIFIED';
  const authorName = isDuoVoice
    ? duoMembers.map(m => m.name).join(' و')
    : member.name;

  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    duoId,
    senderUserId,
    authorName,
    voiceType,
    isDuoVoice,
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };
}

/**
 * Calculates milestone achievements for a duo based on longevity and engagement.
 */
export function calculateDuoMilestones({ joinedAt, postsCount, followersCount }) {
  const now = Date.now();
  const joinDate = new Date(joinedAt).getTime();
  const daysActive = Math.floor((now - joinDate) / (1000 * 60 * 60 * 24));

  return [
    {
      id: 'first_post',
      title: 'أول إشراقة مشتركة',
      description: 'نشر أول منشور موثق على الشبكة',
      isUnlocked: postsCount >= 1,
      badge: '🌱',
    },
    {
      id: '100_days',
      title: '100 يوم شراكة وإلهام',
      description: 'مرور مئة يوم على تفعيل العقد الرقمي للحساب',
      isUnlocked: daysActive >= 100,
      badge: '💯',
    },
    {
      id: '1k_followers',
      title: 'مجتمع الألف صديق',
      description: 'تخطي حاجز 1,000 متابع للثنائي',
      isUnlocked: followersCount >= 1000,
      badge: '🌟',
    },
    {
      id: '1_year',
      title: 'اليوبيل السنوي الأول',
      description: 'إتمام عام كامل من التعاون والملكية المتساوية',
      isUnlocked: daysActive >= 365,
      badge: '🏆',
    },
  ];
}

/**
 * Formats data for viral social share cards.
 */
export function formatShareCardPayload(duo) {
  const cleanHandle = duo.handle.startsWith('@') ? duo.handle : `@${duo.handle}`;
  return {
    handle: cleanHandle,
    title: duo.displayName,
    archetype: duo.archetype || 'duo',
    tagline: 'Two people. One account. Equal ownership.',
    avatars: [duo.avatar1, duo.avatar2],
    shareUrl: `https://myhalf.social/${cleanHandle.replace('@', '')}`,
    qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://myhalf.social/${cleanHandle.replace('@', '')}`,
    generatedAt: new Date().toISOString(),
  };
}
