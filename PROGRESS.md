# Project Progress

> Updated by Claude after each development session. Human-readable project state.

---

## Current status

**As of:** 2026-03-10
**Active branch:** staging/batch-changes
**Open PRDs:** None

---

## What was last worked on

Stripe payment integration for the Penelope monetization model.

**Stripe Checkout**: Created `/api/stripe/checkout` route that creates Stripe Checkout sessions for both one-time persona unlocks (£9) and monthly Pro subscriptions (£29/mo). Supports passing a `personaId` to auto-unlock after payment.

**Stripe Webhooks**: Created `/api/stripe/webhook` route handling `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, and `invoice.payment_failed` events. Uses Supabase service role client (no user session in webhooks).

**Customer Portal**: Created `/api/stripe/portal` route for subscription management via Stripe Billing Portal.

**Pricing Page**: New `/pricing` page with three tiers: Free (1 unlock), Single Unlock (£9), Penelope Pro (£29/mo). Links from header nav already existed.

**Database**: Added `subscriptions` table migration with RLS policies. Users can only read their own subscription; only service role can write (webhook-driven).

**Dashboard Integration**: Dashboard now shows subscription status banner for active subscribers with "Manage Billing" button linking to Stripe portal.

**Persona Page**: Unlock banner now has three states: free unlock, paid unlock (if subscription has credits), or upgrade CTA linking to pricing page with persona context.

---

## What's next

1. **Stripe setup in Stripe Dashboard** — Create products/prices matching env vars, configure webhook endpoint
2. **Test end-to-end payment flow** — Verify checkout, webhook, and persona unlock with Stripe test mode
3. **Subscription enforcement** — Add middleware or API checks to enforce persona creation limits for non-subscribers
4. **PDF export** — Wire up the "Download PDF" button (currently disabled when locked)
5. **Email notifications** — Subscription confirmation and payment receipts

---

## Known issues / blockers

- Static verification caps confidence at 0.85 — runtime verification needed for higher scores
- Hartz Land machine not yet connected
- Docker Desktop + Ollama pending user installation
- tmux required on Hartz Land machine (start-all.sh dependency)

---

## Recent decisions

- **CLAUDE.md size**: Zero `@` imports; docs referenced on-demand, not loaded every turn
- **Docker isolation**: Squid proxy restricts autonomous agents to approved domains only
- **Session management**: tmux + worktrees for automation; Claude Squad as optional TUI monitor only
- **Verification architecture**: Separate agent verifies work against acceptance criteria with proof packets
- **Confidence thresholds**: 0.9+ = auto-merge, 0.7-0.89 = human review, <0.7 = blocked
- **Git worktrees**: Replace file locks with worktree-per-story isolation in Ralph loop
- **Local models**: Ollama + qwen2.5-coder:7b for routine subtasks, auto-fallback to Claude
- **MCP stack**: Playwright, Memory, Sequential Thinking, GitHub, Filesystem

---

## Session history

| Date | What was done | Stories completed |
|------|---------------|------------------|
| — | Initial setup | — |
| 2026-03-04 | Verification system, Hartz Land scripts, MCP setup, proof packets, review queue | N/A (framework enhancement) |
| 2026-03-05 | P0: CLAUDE.md trim, P1: Docker isolation, P1: Session mgmt, P2: Worktrees, P2: Context mgmt, P3: Local models | N/A (framework enhancement) |
| 2026-03-05 | MCPs installed (Playwright, Memory, Filesystem, GitHub w/ PAT), E2E test on hartzai-website (3 bugs fixed), Track 3: auto-PR, tmux orchestration, shared memory | N/A (framework enhancement) |
| 2026-03-10 | Stripe integration: checkout, webhooks, portal, pricing page, subscriptions table, dashboard + persona page wiring | Stripe monetization |
