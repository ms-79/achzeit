# CLAUDE.md — achzeit Website

## Project Overview

**Achzeit** — vacation rental website for Ferienhaus ACHZEIT, Fischen im Allgäu.

Stack: React 18 · TypeScript · Vite · Tailwind CSS · shadcn/ui · Vercel Edge Functions

Integrations:
- **Hostaway** — bookings, calendar, listings, reviews (OAuth2 Client Credentials)
- **Resend** — transactional email (`noreply@allgau-stays.com` → `info@achzeit.de`)
- **Anthropic Claude** — AI descriptions (`amenities.ts`) and review translation (`reviews.ts`)

Deployment: Vercel (team: `allgaeu-stays`, project: `achzeit`)
Repo: https://github.com/ms-79/achzeit

---

## Environment Variables

```
HOSTAWAY_CLIENT_ID       # OAuth client ID
HOSTAWAY_API_TOKEN       # OAuth client secret
HOSTAWAY_BASE_URL        # https://api.hostaway.com/v1
RESEND_API_KEY           # transactional email
ANTHROPIC_API_KEY        # Claude API
```

Never hardcode secrets. Never expose to frontend (all used server-side in `api/`).

---

## API Routes (`api/`)

| File | Purpose |
|---|---|
| `amenities.ts` | Fetch listing amenities + AI-format description |
| `reviews.ts` | Fetch reviews + AI-translate to locale |
| `calendar.ts` | Fetch 14-month availability calendar |
| `contact.ts` | Send contact form email via Resend |

All routes: Vercel Edge Runtime (`export const config = { runtime: 'edge' }`).

**Hostaway auth:** OAuth2 Client Credentials — token cached in-memory per warm instance.

**Anthropic response format:** `data?.content?.[0]?.text` (not `choices[0].message.content`).

---

## Known Gotchas

- In-memory caches (token, reviews, amenities) reset on cold start — expected behavior on Edge.
- `detectLang()` is heuristic-based — edge cases may misdetect short texts.
- Resend `from` address must use a verified domain (`allgau-stays.com`).
- Vercel Edge Runtime does not support Node.js built-ins (`fs`, `crypto`, etc.).

---

## Engineering Philosophy

- Simple, robust, maintainable over clever.
- Boring technology over fragile cleverness.
- Production stability always first.
- Explicit over magic.
- Think like a senior production engineer.

## Planning

For non-trivial tasks: **plan before implementing**.
1. Analyze architecture, dependencies, risks.
2. Write concise implementation plan.
3. Break into verifiable subtasks.
4. Only then implement.

## Verification

Before claiming success:
- Inspect actual code and API shapes.
- Verify env vars are present.
- Run type checks / build if available (`npm run build`).
- Check Vercel deployment logs.

## Coding Standards

- Strong typing, explicit error handling.
- Small focused functions.
- Comments explain WHY, not what.
- No unnecessary dependencies.

## Git

- Logically grouped, minimal commits.
- Never commit `.env` or secrets.
- Push triggers automatic Vercel deployment.
