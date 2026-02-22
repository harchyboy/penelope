# CLAUDE.md - Penelope App

> Hartz Claude Framework integrated. Project-specific rules always take precedence.

---

## CRITICAL: All Sessions Use Staging Branch

**Before making ANY changes**, ensure you are on the correct branch:

```bash
git checkout staging/batch-changes
```

**Workflow:**
1. All Claude sessions commit to staging/batch-changes
2. User reviews all commits together
3. After testing, merge to main and deploy to Vercel

**DO NOT** create new branches or push without explicit user request.

---

## CRITICAL: Read LEARNINGS.md First

Before writing ANY code, read LEARNINGS.md in the project root. It contains:
- Sanity CMS patterns and gotchas
- Next.js patterns that work
- AI persona generation patterns
- Learnings from past development sessions

**After completing work**, if you discovered something important:
1. Append it to LEARNINGS.md under "Iteration Log" with today's date
2. Format: ### YYYY-MM-DD - [Source: Claude Code | Ralph Moss PRD-name]

---

## BEHAVIOURAL RULES

These rules apply to every session, every agent, every task. No exceptions.

### File discipline
- ALWAYS read a file before editing it -- never assume its current contents
- NEVER create new files unless absolutely necessary -- prefer editing existing files
- NEVER commit secrets, API keys, credentials, or .env files
- ALWAYS verify imports resolve before committing TypeScript changes
- ALWAYS check LEARNINGS.md for known patterns before implementing a novel solution
- NEVER retry a known failed approach -- check LEARNINGS.md first

### Quality discipline
- ALWAYS run npm run lint before committing
- NEVER leave TODO comments in committed code without a linked task
- ALWAYS update PROGRESS.md after completing any task
- If stuck on the same bug for more than 3 attempts: document it, try a different strategy

### Persona output discipline
- Penelope outputs must always be actionable -- every insight tied to a practical implication
- B2C outputs: individual buyer personas (psychology, motivations, decision patterns, language)
- B2B outputs: company profile PLUS individual personas for every stakeholder in the buying group
- NEVER produce surface-level demographic summaries -- that is explicitly what Penelope is NOT
- Persona outputs must address: trigger events, fears, decision criteria, proof points, objections

### Review and deploy discipline
- ALWAYS run /review before deploying to Vercel
- NEVER deploy with P1 findings outstanding
- /compound runs automatically after fixing any P1 or P2 finding

---

## MODEL ROUTING

| Task | Model |
|------|-------|
| Orchestrator / team lead | Opus |
| Persona generation logic, AI framework implementation | Opus |
| Feature implementation, code review | Sonnet |
| Codebase exploration, grep, read-only | Haiku |
| Test generation, documentation | Haiku |

Note: Persona generation (the core AI product) should always use Opus -- this is the quality-critical path.

---

## WORKFLOW DECISION GUIDE

**Use Ralph Moss** (bash scripts/ralph.sh --max-plan --quality-gate) when:
- Building a new persona framework or output type
- Adding a new feature across multiple files (more than 30 min of AI work)

**Use Agent Teams** (/review) when:
- Reviewing before deploy
- Debugging persona generation quality or output consistency

**Stay single-agent** when:
- Updating Sanity schemas, UI copy, single file edits
- Tweaking prompt engineering on existing persona frameworks

---

## Project Overview

Penelope is an AI-powered customer persona expert created by Hartz AI.

Most businesses work from surface-level customer assumptions -- age ranges, job titles, geography. Penelope goes much deeper, using established academic frameworks and practical marketing models to reveal the psychology behind why customers buy.

### What Penelope produces

For B2C:
- Individual buyer personas with psychological needs, core motivations, decision-making patterns
- Specific language and proof points that move each persona to action

For B2B:
- A company profile alongside individual personas for every stakeholder in the buying group
- Covers the full buying committee: from the person who spotted the problem to the one who signs the contract

### What makes Penelope different

Every insight is tied to a practical implication -- what to say, how to say it, what objections to address, what fears to put to rest. The output is a blueprint for winning customer trust, not a demographics report.

### Core persona dimensions
- Trigger events -- what made them start looking for a solution
- Core fears -- what they are afraid of when making a decision
- Decision criteria -- what they need to see or hear before committing
- Communication style -- exactly how to resonate with this person
- Objections -- what will stop them, and how to address it
- Proof points -- what evidence moves them to action

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| CMS | Sanity CMS (headless) |
| AI | Anthropic Claude (Opus for persona generation) |
| Styling | Tailwind CSS |
| Hosting | Vercel |

## Project Structure

```
penelope-app/
├── app/                  # Next.js App Router pages
├── components/
│   ├── ui/               # Reusable UI components
│   ├── persona/          # Persona display and generation components
│   └── layout/           # Navigation, shell, etc.
├── lib/
│   ├── sanity/           # Sanity client and queries
│   ├── ai/               # Persona generation logic and prompts
│   └── utils.ts
├── sanity/               # Sanity CMS schema and config
└── types/                # TypeScript interfaces
```

## Key Patterns

### Sanity CMS Queries

```typescript
import { client } from '@/lib/sanity';
const data = await client.fetch(`*[_type == "persona"] { title, slug, content }`);
```

### Persona Generation

All persona generation logic lives in lib/ai/. Always use Opus for generation calls:

```typescript
// Always Opus for persona generation -- quality is the product
const response = await anthropic.messages.create({
  model: 'claude-opus-4-6',
});
```

## Common Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint check
```

## Common Pitfalls

- Using Sonnet for persona generation -- always use Opus, the persona output quality IS the product
- Surface-level outputs -- every persona insight must be actionable, never just descriptive
- Missing B2B stakeholder coverage -- B2B personas must cover the full buying committee, not just one person
- Sanity queries using wrong syntax -- Sanity uses GROQ, not GraphQL
- Hardcoding content that should live in Sanity CMS
- Using next/img instead of next/image -- always use the Next.js Image component
