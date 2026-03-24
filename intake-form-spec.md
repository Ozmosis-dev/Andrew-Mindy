# Client Intake Form — Build Spec
## Andrew Mindy Studio

---

## Overview

A multi-service client intake form with conditional logic. Selecting a service reveals a tailored question set for that service only. Multiple services can be selected simultaneously. The form lives on the `/work-with-me` (or `/contact`) page of andrewmindy.com.

**Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Resend (email), Supabase (storage)  
**Submission behavior:** Store to Supabase + send email notification to contact@andrewmindy.com  
**Spam prevention:** Honeypot field (hidden input, reject if populated)  
**After submit:** Show inline confirmation message, no page redirect

---

## File Structure

```
app/
  work-with-me/
    page.tsx               ← page wrapper
components/
  intake/
    IntakeForm.tsx         ← main form component (client component)
    ServiceSelector.tsx    ← service card grid with checkbox logic
    BrandSection.tsx       ← conditional brand questions
    WebSection.tsx         ← conditional website questions
    AppSection.tsx         ← conditional app/tooling questions
    RevOpsSection.tsx      ← conditional revops questions
    RadioGroup.tsx         ← reusable single-select radio group
    CheckGroup.tsx         ← reusable multi-select checkbox group
    SubmitButton.tsx       ← submit + loading state
    SuccessScreen.tsx      ← post-submit confirmation
app/
  api/
    intake/
      route.ts             ← POST handler: validate → Supabase → Resend
lib/
  supabase.ts              ← Supabase client
  resend.ts                ← Resend client
  intake-schema.ts         ← Zod schema for form validation
```

---

## Form State Shape (TypeScript)

```typescript
type ServiceType = 'brand' | 'web' | 'app' | 'revops'

interface IntakeFormData {
  // Universal
  name: string                        // required
  email: string                       // required
  company: string
  role: string
  website: string
  services: ServiceType[]             // required, min 1
  situation: string                   // required
  previousAttempts: string
  decisionMaker: 'me' | 'partner' | 'committee' | ''
  budget: 'u5' | '5-15' | '15-30' | '30-50' | '50p' | 'ns' | ''  // required
  timeline: 'asap' | '1-3' | '3-6' | 'flex' | ''                  // required
  anythingElse: string
  honeypot: string                    // must be empty

  // Brand section (shown when services includes 'brand')
  brand: {
    situation: 'new' | 'rebrand' | 'refresh' | ''
    businessDescription: string       // required if brand selected
    mission: string
    customerDescription: string       // required if brand selected
    competitors: string               // required if brand selected
    coreMessages: string
    personality: 'expert' | 'advisor' | 'visionary' | 'premium' | 'bold' | ''  // required if brand selected
    wordsYes: string
    wordsNo: string
    brandAdmired: string
    existingAssets: 'keep' | 'retire' | 'none' | ''
    deliverables: string[]            // checkboxes
    agencyHistory: string
  }

  // Website section (shown when services includes 'web')
  web: {
    currentSite: 'none' | 'rebuild' | 'update' | ''
    primaryJob: 'leads' | 'cred' | 'convert' | 'launch' | ''       // required if web selected
    brokenAndCost: string             // required if web selected
    successMetrics: string
    mustHaveFeatures: string
    techPreference: 'cms' | 'custom' | 'open' | ''
    copyStatus: 'ready' | 'rough' | 'none' | ''
    postLaunchOwner: 'internal' | 'dev' | 'ongoing' | 'tbd' | ''
    siteInspiration: string
  }

  // App section (shown when services includes 'app')
  app: {
    coreFunction: string              // required if app selected
    userType: 'int' | 'ext' | 'both' | ''   // required if app selected
    userVolume: string
    systemConnections: string
    sensitiveData: 'yes' | 'no' | 'unsure' | ''
    specStatus: 'defined' | 'partial' | 'loose' | ''  // required if app selected
    costOfInaction: string
    operationalDone: string
    previousAttempts: string
  }

  // RevOps section (shown when services includes 'revops')
  revops: {
    brokenProcess: string             // required if revops selected
    problemType: 'people' | 'process' | 'tools' | 'all' | ''  // required if revops selected
    currentStack: string
    affectedCount: 'solo' | 'sm' | 'md' | 'lg' | ''
    adoptionHistory: string
    successAt90Days: string           // required if revops selected
    budgetStatus: 'yes' | 'pending' | 'tbd' | ''
  }
}
```

---

## API Route Behavior (`/api/intake`)

**Method:** POST  
**Content-Type:** application/json

### Steps

1. Parse and validate body with Zod schema
2. Reject if `honeypot` field is populated (return 200 to fool bots)
3. Insert full form data to Supabase `intake_submissions` table
4. Send email notification via Resend to `contact@andrewmindy.com`
5. Return `{ success: true }`

### Email Notification Format

**Subject:** `New inquiry — [name] · [services joined] · [budget]`

**Body (plain text):**
```
Name: [name]
Email: [email]
Company: [company]
Role: [role]
Website: [website]

Services: [services]
Decision maker: [decisionMaker]
Budget: [budget]
Timeline: [timeline]

SITUATION
[situation]

PREVIOUS ATTEMPTS
[previousAttempts]

--- BRAND ---
[all brand fields if present]

--- WEBSITE ---
[all web fields if present]

--- APP / TOOLING ---
[all app fields if present]

--- REVOPS ---
[all revops fields if present]

ANYTHING ELSE
[anythingElse]
```

---

## Supabase Table: `intake_submissions`

```sql
create table intake_submissions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name text not null,
  email text not null,
  company text,
  role text,
  website text,
  services text[] not null,
  situation text not null,
  previous_attempts text,
  decision_maker text,
  budget text not null,
  timeline text not null,
  anything_else text,
  brand_data jsonb,
  web_data jsonb,
  app_data jsonb,
  revops_data jsonb
);
```

---

## Component Behavior

### Service Cards (`ServiceSelector.tsx`)
- 2×2 grid of clickable cards
- Each card contains a hidden checkbox input
- Clicking a card toggles the checkbox and adds/removes `.selected` styling
- Multiple can be selected simultaneously
- Selecting a service reveals its conditional section below (smooth scroll into view)
- Deselecting hides and clears that section's fields

**Services:**
| Value | Label | Subtitle |
|---|---|---|
| `brand` | Brand Identity & Strategy | Positioning, visual identity, messaging |
| `web` | Website Design & Development | Strategy, copy, design, development |
| `app` | Web App / Custom Tooling | Platforms, CRMs, internal tools |
| `revops` | Revenue Operations & Systems | Workflows, SOPs, automation, training |

### RadioGroup (`RadioGroup.tsx`)
- Props: `name`, `options: {value, label}[]`, `value`, `onChange`, `required?`
- Renders as styled label+radio pairs
- Selected option gets highlighted border/background
- Accessible: keyboard navigable, proper aria attributes

### CheckGroup (`CheckGroup.tsx`)
- Props: `name`, `options: {value, label}[]`, `value: string[]`, `onChange`
- Renders as styled label+checkbox pairs
- Multiple selection, same visual treatment as RadioGroup

### Progress Bar
- Thin 2px bar at top of form
- Tracks: required text fields filled + service selected + budget selected + timeline selected
- Updates on every keystroke and selection change
- Animates width with CSS transition

### Validation
- Client-side: required fields marked, inline error messages below field on blur
- Service-conditional required fields only validate if that service is selected
- Server-side: Zod schema mirrors client validation
- Error display: small red text below the field, no blocking modals

### Success Screen
- Replaces form content inline (no redirect)
- Copy:
  - Heading: "Got it — I'll be in touch."
  - Body: "I review every submission personally. If what you've shared sounds like a fit, I'll reach out within 24 hours to schedule a 30-minute call. If it's not the right match, I'll let you know and point you somewhere useful."

---

## Environment Variables Required

```
NEXT_PUBLIC_SUPABASE_URL=https://cytolyclwiligdcsfibz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5dG9seWNsd2lsaWdkY3NmaWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxNDc0MzQsImV4cCI6MjA4OTcyMzQzNH0.g2i7DR846kxkpagEjQJVyNC8HovA5CTuRd7UEmW9_Ew
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5dG9seWNsd2lsaWdkY3NmaWJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDE0NzQzNCwiZXhwIjoyMDg5NzIzNDM0fQ.lMJl3lXX-G9wj-1FLIkUqJ8GqiaY2Gwn0OkZrMLxmIk
RESEND_API_KEY=re_Xz4yEvT2_8uXWaUWht8MGPn6uoB49KyhC
NOTIFICATION_EMAIL=info@andrewmindy.com
```

---

## Styling Notes

- Follow existing site design system (Tailwind classes, font, color tokens)
- Form max-width: 700px, centered
- Section labels: 11px uppercase, tracked, muted color
- Conditional sections separated by a subtle top border
- Radio/checkbox labels: full-width, bordered, highlight on select
- Two-column grid for short paired fields (name/email, budget/timeline)
- No external form libraries — build native with React controlled components
- Accessible: all inputs have associated labels, `aria-required` on required fields, `aria-describedby` for hint text

---

*Spec version: 1.0 — March 2026*
