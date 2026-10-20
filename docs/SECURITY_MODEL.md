# MYHALF — Security Model, Governance & RLS Architecture

## 1. Threat Modeling & Security Principles

MYHALF's dual-ownership model introduces novel security paradigms that standard single-user platforms cannot accommodate. We operate under a **Zero-Trust Multi-Principal** threat model.

### Key Threat Vectors & Mitigations
| Threat Vector | Description | Architecture Mitigation |
|---|---|---|
| **Hostile Takeover** | One co-owner attempts to unilaterally kick out, demote, or lock out their partner. | **Schema & RLS Invariant:** Membership cannot be modified unilaterally. Sensitive modifications require atomic dual approvals with distinct cryptographically hashed proposals. |
| **Coercion & Abuse** | A victim of domestic coercion or harassment is trapped in an account with their abuser. | **Unilateral Safety Escape:** Any owner can unilaterally freeze the account and submit confidential abuse reports without notifying or requiring permission from the other owner. |
| **Replay & Front-Running** | An attacker captures an approval token for an innocent change and applies it to an unauthorized change. | **Cryptographic Nonce & Hash:** Proposals are bound to `SHA256(duo_id || proposal_type || payload || nonce)`. Execution fails if the hash does not match at execution time. |
| **Cross-Owner Privacy Leak** | Co-owner views private credentials, emergency email, or safety reporting history of their partner. | **Private/Shared Partition:** `users` table holds private owner data with RLS restricting access exclusively to `auth.uid() = id`. `emergency_actions` are invisible to co-owners. |
| **Duo Impersonation** | Attacker publishes unauthorized posts as a duo without membership. | **Strict RLS on Posts:** Insert policies strictly mandate that `auth.uid()` belongs to `duo_members` for the target `duo_id`. |

---

## 2. PostgreSQL Row-Level Security (RLS) Policies

All tables in the MYHALF database have RLS enabled:
`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`

### 2.1. Private User Profiles (`public.users`)
```sql
-- Users can read and update ONLY their own private record
CREATE POLICY user_read_own ON public.users
    FOR SELECT TO authenticated
    USING (auth.uid() = id);

CREATE POLICY user_update_own ON public.users
    FOR UPDATE TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
```

### 2.2. Duo Accounts (`public.duo_accounts`)
```sql
-- Public can view active, public duos
CREATE POLICY duo_public_read ON public.duo_accounts
    FOR SELECT TO anon, authenticated
    USING (status = 'ACTIVE' AND privacy = 'PUBLIC');

-- Members can view their own duo in any state (PENDING, FROZEN, ARCHIVED)
CREATE POLICY duo_member_read ON public.duo_accounts
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.duo_members 
            WHERE duo_id = duo_accounts.id AND user_id = auth.uid()
        )
    );

-- Duo identity update permitted ONLY via verified server-side governance execution
-- Direct client-side updates are prohibited by default (REVOKE UPDATE on sensitive columns).
```

### 2.3. Duo Members (`public.duo_members`)
```sql
-- Public can view members of active public duos (for public profile display)
CREATE POLICY member_public_read ON public.duo_members
    FOR SELECT TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.duo_accounts 
            WHERE id = duo_members.duo_id AND status = 'ACTIVE' AND privacy = 'PUBLIC'
        )
    );

-- Co-owners can view their duo membership
CREATE POLICY member_coowner_read ON public.duo_members
    FOR SELECT TO authenticated
    USING (user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.duo_members dm2 
        WHERE dm2.duo_id = duo_members.duo_id AND dm2.user_id = auth.uid()
    ));

-- Client-side direct INSERT/UPDATE/DELETE on duo_members is completely RESTRICTED
-- Must go through PostgreSQL stored procedures (RPC) with transactional invariant checks.
```

### 2.4. Posts (`public.posts`)
```sql
-- Public read for published posts of public duos
CREATE POLICY post_public_read ON public.posts
    FOR SELECT TO anon, authenticated
    USING (
        status = 'PUBLISHED' AND EXISTS (
            SELECT 1 FROM public.duo_accounts 
            WHERE id = posts.duo_id AND status = 'ACTIVE' AND privacy = 'PUBLIC'
        )
    );

-- Co-owners can read all posts (including drafts and pending approvals) for their duo
CREATE POLICY post_member_read ON public.posts
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.duo_members 
            WHERE duo_id = posts.duo_id AND user_id = auth.uid()
        )
    );

-- Co-owners can create posts for their active duo
CREATE POLICY post_member_insert ON public.posts
    FOR INSERT TO authenticated
    WITH CHECK (
        created_by_user_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM public.duo_members 
            WHERE duo_id = posts.duo_id AND user_id = auth.uid() AND status = 'ACTIVE'
        )
    );

-- Updates allowed only while post is DRAFT or PENDING_CO_OWNER
CREATE POLICY post_member_update ON public.posts
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.duo_members 
            WHERE duo_id = posts.duo_id AND user_id = auth.uid()
        ) AND status IN ('DRAFT', 'PENDING_CO_OWNER')
    );
```

### 2.5. Governance Proposals (`public.governance_proposals`)
```sql
-- Co-owners can read proposals for their duo
CREATE POLICY proposal_member_read ON public.governance_proposals
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.duo_members 
            WHERE duo_id = governance_proposals.duo_id AND user_id = auth.uid()
        )
    );

-- Co-owner can create a proposal
CREATE POLICY proposal_member_insert ON public.governance_proposals
    FOR INSERT TO authenticated
    WITH CHECK (
        proposed_by_user_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM public.duo_members 
            WHERE duo_id = governance_proposals.duo_id AND user_id = auth.uid()
        )
    );
```

### 2.6. Confidential Emergency Actions (`public.emergency_actions`)
```sql
-- Only the initiating user can view their own emergency action!
-- THE CO-OWNER CANNOT READ THIS ROW (CRITICAL DOMESTIC SAFETY RULE).
CREATE POLICY emergency_action_private_read ON public.emergency_actions
    FOR SELECT TO authenticated
    USING (triggered_by_user_id = auth.uid());

-- Any co-owner can trigger an emergency action
CREATE POLICY emergency_action_insert ON public.emergency_actions
    FOR INSERT TO authenticated
    WITH CHECK (
        triggered_by_user_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM public.duo_members 
            WHERE duo_id = emergency_actions.duo_id AND user_id = auth.uid()
        )
    );
```

---

## 3. Dual-Approval State Machine & Replay Protection

### 3.1. Proposal Hashing Algorithm
Whenever an owner proposes a sensitive change:
$$\text{proposal\_hash} = \text{HMAC-SHA256}(\text{duo\_id} + \text{proposal\_type} + \text{canonical\_json}(\text{payload}) + \text{nonce})$$

1. **Initiation:** Owner 1 submits proposal. Status: `PENDING`. Expiry: `+72 hours`.
2. **Review:** Owner 2 examines the exact changes.
3. **Approval:** Owner 2 signs the approval. System verifies `approved_by_user_id != proposed_by_user_id`.
4. **Atomic Execution:** In a single database transaction, the proposal status becomes `EXECUTED`, the target resource (`duo_accounts`) is updated, and an immutable entry is added to `governance_audit_log`.

---

## 4. Abuse Prevention & Safety Protocols

1. **Immediate Account Lockdown on Safety Trigger:** If either owner calls `trigger_safety_freeze(duo_id, reason)`, the duo status is immediately transitioned to `FROZEN`. All posting, comments, profile updates, and social discovery are suspended instantly.
2. **Confidential Support Handoff:** The safety trigger alert goes directly to the Trust & Safety team. No push notification or in-app indicator reveals to the co-owner that an abuse report was filed.
3. **No Co-owner Interception of Direct Messages or Auth:** There is no shared mailbox for private auth resets. Password recovery is dispatched strictly to the individual private email stored in `users`.
