import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { intakeSchema } from '@/lib/intake-schema'
import { createServiceClient } from '@/lib/supabase'

const resend = new Resend(process.env.RESEND_API_KEY)

// ─── Email body builder ───────────────────────────────────────────────────────

function row(label: string, value: string | undefined): string {
  if (!value) return ''
  return `${label}: ${value}\n`
}

function section(title: string, lines: string): string {
  const body = lines.trim()
  if (!body) return ''
  return `\n--- ${title} ---\n${body}\n`
}

function buildEmailBody(data: ReturnType<typeof intakeSchema.parse>): string {
  const universal = [
    row('Name',             data.name),
    row('Email',            data.email),
    row('Company',          data.company),
    row('Role',             data.role),
    row('Website',          data.website),
    '',
    row('Services',         data.services.join(', ')),
    row('Decision maker',   data.decisionMaker),
    row('Budget',           data.budget),
    row('Timeline',         data.timeline),
    '',
    'SITUATION',
    data.situation,
    '',
    data.previousAttempts ? `PREVIOUS ATTEMPTS\n${data.previousAttempts}` : '',
  ].join('\n')

  const brand = section('BRAND', [
    row('Situation',              data.brand.situation),
    row('Business description',   data.brand.businessDescription),
    row('Mission',                data.brand.mission),
    row('Customer',               data.brand.customerDescription),
    row('Competitors',            data.brand.competitors),
    row('Core messages',          data.brand.coreMessages),
    row('Personality',            data.brand.personality),
    row('Words yes',              data.brand.wordsYes),
    row('Words no',               data.brand.wordsNo),
    row('Brand admired',          data.brand.brandAdmired),
    row('Existing assets',        data.brand.existingAssets),
    row('Deliverables',           data.brand.deliverables.join(', ')),
    row('Agency history',         data.brand.agencyHistory),
  ].join(''))

  const web = section('WEBSITE', [
    row('Current site',       data.web.currentSite),
    row('Primary job',        data.web.primaryJob),
    row('Broken & cost',      data.web.brokenAndCost),
    row('Success metrics',    data.web.successMetrics),
    row('Must-have features', data.web.mustHaveFeatures),
    row('Tech preference',    data.web.techPreference),
    row('Copy status',        data.web.copyStatus),
    row('Post-launch owner',  data.web.postLaunchOwner),
    row('Site inspiration',   data.web.siteInspiration),
  ].join(''))

  const app = section('APP / TOOLING', [
    row('Core function',      data.app.coreFunction),
    row('User type',          data.app.userType),
    row('User volume',        data.app.userVolume),
    row('System connections', data.app.systemConnections),
    row('Sensitive data',     data.app.sensitiveData),
    row('Spec status',        data.app.specStatus),
    row('Cost of inaction',   data.app.costOfInaction),
    row('Operational done',   data.app.operationalDone),
    row('Previous attempts',  data.app.previousAttempts),
  ].join(''))

  const revops = section('REVOPS', [
    row('Broken process',   data.revops.brokenProcess),
    row('Problem type',     data.revops.problemType),
    row('Current stack',    data.revops.currentStack),
    row('Affected count',   data.revops.affectedCount),
    row('Adoption history', data.revops.adoptionHistory),
    row('Success at 90d',   data.revops.successAt90Days),
    row('Budget status',    data.revops.budgetStatus),
  ].join(''))

  const tail = data.anythingElse
    ? `\nANYTHING ELSE\n${data.anythingElse}\n`
    : ''

  return [universal, brand, web, app, revops, tail].filter(Boolean).join('')
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // 1. Validate
    const result = intakeSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
    }

    const data = result.data

    // 2. Honeypot check — return 200 to fool bots
    if (data.honeypot) {
      return NextResponse.json({ success: true })
    }

    // 3. Insert to Supabase
    const supabase = createServiceClient()
    const { error: dbError } = await supabase.from('intake_submissions').insert({
      name:             data.name,
      email:            data.email,
      company:          data.company || null,
      role:             data.role || null,
      website:          data.website || null,
      services:         data.services,
      situation:        data.situation,
      previous_attempts: data.previousAttempts || null,
      decision_maker:   data.decisionMaker || null,
      budget:           data.budget,
      timeline:         data.timeline,
      anything_else:    data.anythingElse || null,
      brand_data:       data.services.includes('brand') ? data.brand : null,
      web_data:         data.services.includes('web')   ? data.web   : null,
      app_data:         data.services.includes('app')   ? data.app   : null,
      revops_data:      data.services.includes('revops')? data.revops: null,
    })

    if (dbError) {
      console.error('[intake] Supabase error:', dbError)
      return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 })
    }

    // 4. Send email notification
    const subject = `New inquiry — ${data.name} · ${data.services.join(', ')} · ${data.budget}`
    const emailBody = buildEmailBody(data)

    const { error: emailError } = await resend.emails.send({
      from:    'Andrew Mindy <contact@andrewmindy.com>',
      to:      'contact@andrewmindy.com',
      replyTo: data.email,
      subject,
      text:    emailBody,
    })

    if (emailError) {
      console.error('[intake] Resend error:', emailError)
      // Don't fail the request — data is saved; email is best-effort
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[intake]', err)
    return NextResponse.json({ error: 'Submission failed. Please try again.' }, { status: 500 })
  }
}
