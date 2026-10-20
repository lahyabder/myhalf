-- ==============================================================================
-- MYHALF — Production Seed Data
-- ==============================================================================

-- 1. Insert Initial Users
INSERT INTO public.users (id, email, full_name, display_name, avatar_url, preferred_locale, is_verified) VALUES
('11111111-1111-1111-1111-111111111111', 'sara@example.com', 'سارة المنصوري', 'سارة', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'ar', true),
('22222222-2222-2222-2222-222222222222', 'omar@example.com', 'عمر الفاسي', 'عمر', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'ar', true),
('33333333-3333-3333-3333-333333333333', 'karim@example.com', 'كريم التهامي', 'كريم', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'ar', true),
('44444444-4444-4444-4444-444444444444', 'youssef@example.com', 'يوسف الناصري', 'يوسف', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150', 'ar', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Active Duo Accounts
INSERT INTO public.duo_accounts (id, handle, display_name, bio, avatar_url, status, privacy, archetype, streak_count) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'sara_and_omar', 'سارة وعمر', 'شخصان. حساب واحد. رحلتنا وإبداعاتنا المشتركة بين نواكشوط والدار البيضاء.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'ACTIVE', 'PUBLIC', 'couples', 43),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'tech_duo', 'كريم ويوسف', 'مؤسسان تقنيان نبني معاً تطبيقات الجيل القادم. حساب مشترك بالتساوي.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'ACTIVE', 'PUBLIC', 'founders', 19)
ON CONFLICT (id) DO NOTHING;

-- 3. Associate Duo Members
INSERT INTO public.duo_members (duo_id, user_id, role, status, owner_slot) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'CO_OWNER', 'ACTIVE', 1),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'CO_OWNER', 'ACTIVE', 2),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'CO_OWNER', 'ACTIVE', 1),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'CO_OWNER', 'ACTIVE', 2)
ON CONFLICT DO NOTHING;

-- 4. Insert Daily Prompt
INSERT INTO public.daily_prompts (id, prompt_date, question_ar, question_en, question_fr) VALUES
('dddddddd-dddd-dddd-dddd-dddddddddddd', CURRENT_DATE, 'ما هو الشيء الذي أنجزتماه معاً هذا الأسبوع وجعلكما فخورين ببعضكما؟', 'What did you achieve together this week that made you proud of each other?', 'Qu''avez-vous accompli ensemble cette semaine qui vous a rendu fiers l''un de l''autre?')
ON CONFLICT DO NOTHING;
