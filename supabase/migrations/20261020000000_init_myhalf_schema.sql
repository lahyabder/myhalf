-- ==============================================================================
-- MYHALF — Production PostgreSQL & Supabase Database Migration
-- Version: 0.1.0
-- Invariant: Strictly 2 co-owners per duo; equal governance; zero unilateral eviction.
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Custom Enumerated Types
DO $$ BEGIN
    CREATE TYPE duo_status AS ENUM (
        'PENDING_PARTNER',
        'ACTIVE',
        'EMERGENCY_FROZEN',
        'ARCHIVED_SUNSET',
        'MEMORIALIZED',
        'PROJECT_COMPLETED',
        'SUSPENDED_CUSTODY'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE duo_privacy AS ENUM ('PUBLIC', 'PRIVATE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE member_status AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE invitation_status AS ENUM ('PENDING', 'ACCEPTED', 'REVOKED', 'EXPIRED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE post_type AS ENUM ('STANDARD', 'TWO_PERSPECTIVES');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE proposal_status AS ENUM ('PENDING', 'EXECUTED', 'REJECTED', 'EXPIRED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3. Private Users Table (1 row per human individual)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    preferred_locale TEXT NOT NULL DEFAULT 'ar' CHECK (preferred_locale IN ('ar', 'fr', 'en')),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    emergency_contact_email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Shared Public Duo Accounts Table (1 row per 2-person duo account)
CREATE TABLE IF NOT EXISTS public.duo_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    handle TEXT NOT NULL UNIQUE CHECK (handle ~ '^[a-z0-9_]{3,30}$'),
    display_name TEXT NOT NULL CHECK (char_length(display_name) <= 60),
    bio TEXT CHECK (char_length(bio) <= 300),
    avatar_url TEXT,
    header_url TEXT,
    status duo_status NOT NULL DEFAULT 'PENDING_PARTNER',
    privacy duo_privacy NOT NULL DEFAULT 'PUBLIC',
    archetype TEXT DEFAULT 'friends', -- 'couples', 'friends', 'creatives', 'founders', 'siblings'
    streak_count INT NOT NULL DEFAULT 0,
    deceased_user_id UUID REFERENCES public.users(id),
    steward_user_id UUID REFERENCES public.users(id),
    memorial_seal_hash TEXT,
    duress_shield_active BOOLEAN NOT NULL DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    frozen_at TIMESTAMPTZ,
    frozen_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Duo Members Table (Associates strictly 2 users per duo account)
CREATE TABLE IF NOT EXISTS public.duo_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    duo_id UUID NOT NULL REFERENCES public.duo_accounts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'CO_OWNER' CHECK (role = 'CO_OWNER'),
    status member_status NOT NULL DEFAULT 'ACTIVE',
    owner_slot INT NOT NULL CHECK (owner_slot IN (1, 2)),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (duo_id, user_id),
    UNIQUE (duo_id, owner_slot)
);

-- 6. Partner Invitations Table (Cryptographic onboarding link tokens)
CREATE TABLE IF NOT EXISTS public.partner_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    duo_id UUID NOT NULL REFERENCES public.duo_accounts(id) ON DELETE CASCADE,
    inviter_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    invitee_email TEXT NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    status invitation_status NOT NULL DEFAULT 'PENDING',
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Posts Table (Supports Standard & Two-Perspectives formats)
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    duo_id UUID NOT NULL REFERENCES public.duo_accounts(id) ON DELETE CASCADE,
    post_type post_type NOT NULL DEFAULT 'STANDARD',
    
    -- Standard Single-Voice Content
    author_user_id UUID REFERENCES public.users(id),
    caption TEXT,
    media_url TEXT,
    
    -- Two-Perspectives Balanced Dual Content
    partner1_user_id UUID REFERENCES public.users(id),
    partner1_caption TEXT,
    partner1_media_url TEXT,
    partner2_user_id UUID REFERENCES public.users(id),
    partner2_caption TEXT,
    partner2_media_url TEXT,
    
    is_memorial_tribute BOOLEAN NOT NULL DEFAULT FALSE,
    is_locked_by_memorial BOOLEAN NOT NULL DEFAULT FALSE,
    like_count INT NOT NULL DEFAULT 0,
    comment_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Daily Prompts & Blind Answers Table
CREATE TABLE IF NOT EXISTS public.daily_prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prompt_date DATE NOT NULL UNIQUE,
    question_ar TEXT NOT NULL,
    question_en TEXT NOT NULL,
    question_fr TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.daily_prompt_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prompt_id UUID NOT NULL REFERENCES public.daily_prompts(id) ON DELETE CASCADE,
    duo_id UUID NOT NULL REFERENCES public.duo_accounts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    answer_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (prompt_id, duo_id, user_id)
);

-- 9. Replay-Safe Governance Proposals Table (Dual Approvals)
CREATE TABLE IF NOT EXISTS public.governance_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    duo_id UUID NOT NULL REFERENCES public.duo_accounts(id) ON DELETE CASCADE,
    proposer_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    action_payload JSONB NOT NULL,
    proposal_hash TEXT NOT NULL UNIQUE,
    nonce TEXT NOT NULL,
    status proposal_status NOT NULL DEFAULT 'PENDING',
    approvals JSONB NOT NULL DEFAULT '[]'::jsonb,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '48 hours'),
    executed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Emergency Safety Actions Table
CREATE TABLE IF NOT EXISTS public.emergency_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    duo_id UUID NOT NULL REFERENCES public.duo_accounts(id) ON DELETE CASCADE,
    initiator_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL, -- 'SAFETY_FREEZE', 'ABUSE_REPORT', 'DURESS_SHIELD'
    reason TEXT,
    is_confidential_from_partner BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Social Follows, Likes, and Comments
CREATE TABLE IF NOT EXISTS public.follows (
    follower_duo_id UUID NOT NULL REFERENCES public.duo_accounts(id) ON DELETE CASCADE,
    following_duo_id UUID NOT NULL REFERENCES public.duo_accounts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (follower_duo_id, following_duo_id)
);

CREATE TABLE IF NOT EXISTS public.likes (
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    duo_id UUID NOT NULL REFERENCES public.duo_accounts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (post_id, duo_id)
);

CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    duo_id UUID NOT NULL REFERENCES public.duo_accounts(id) ON DELETE CASCADE,
    author_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Row Level Security (RLS) Enablement
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duo_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duo_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_prompt_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.governance_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_actions ENABLE ROW LEVEL SECURITY;

-- 13. RLS Security Policies
-- Public can read active public duo accounts
CREATE POLICY "Public Read Active Duos" ON public.duo_accounts
    FOR SELECT USING (status IN ('ACTIVE', 'MEMORIALIZED', 'PROJECT_COMPLETED', 'ARCHIVED_SUNSET') AND privacy = 'PUBLIC');

-- Duo members can read their own duo account in any status (including FROZEN)
CREATE POLICY "Members Read Own Duo" ON public.duo_accounts
    FOR SELECT USING (id IN (SELECT duo_id FROM public.duo_members WHERE user_id = auth.uid()));

-- Co-owners can insert proposals for their duo
CREATE POLICY "CoOwners Insert Proposals" ON public.governance_proposals
    FOR INSERT WITH CHECK (duo_id IN (SELECT duo_id FROM public.duo_members WHERE user_id = auth.uid() AND status = 'ACTIVE'));

-- Confidential Emergency Actions are visible only to the initiator
CREATE POLICY "Confidential Emergency Isolation" ON public.emergency_actions
    FOR SELECT USING (initiator_user_id = auth.uid());

-- Co-owners can always insert emergency action unilaterally
CREATE POLICY "Unilateral Emergency Insert" ON public.emergency_actions
    FOR INSERT WITH CHECK (initiator_user_id = auth.uid() AND duo_id IN (SELECT duo_id FROM public.duo_members WHERE user_id = auth.uid()));

-- Blind Reveal Privacy on Daily Prompts:
-- You can only read your partner's answer if you have already submitted your own answer for that prompt!
CREATE POLICY "Blind Reveal Guard" ON public.daily_prompt_answers
    FOR SELECT USING (
        user_id = auth.uid() 
        OR 
        EXISTS (
            SELECT 1 FROM public.daily_prompt_answers self_ans 
            WHERE self_ans.prompt_id = daily_prompt_answers.prompt_id 
              AND self_ans.duo_id = daily_prompt_answers.duo_id 
              AND self_ans.user_id = auth.uid()
        )
    );
