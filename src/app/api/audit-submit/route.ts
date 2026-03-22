import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

const CATEGORY_LABELS = [
  'Sales System',
  'Brand Positioning',
  'Lead Operations',
  'Internal Workflows',
  'Marketing Infrastructure',
  'Growth Readiness',
];

const PRIORITY_INSIGHTS: Record<number, string> = {
  0: "The highest-ROI fix available to most growth-stage companies is a documented, trainable sales system. A 10-point improvement in close rate — achievable in 90 days with the right process — compounds across every rep you ever hire.",
  1: "Brand is the silent variable in every sales conversation. A brand that accurately represents your capability removes objections before they're raised and attracts clients who are already pre-sold on the quality of your work.",
  2: "Lead operations are where most companies leak the most invisible revenue. The deals you didn't close because the follow-up didn't happen don't show up in any report — but they're real, and the cost compounds monthly.",
  3: "Every process that lives in someone's head is a growth ceiling. Systematizing operations isn't overhead — it's the infrastructure that lets revenue scale without proportionally scaling stress.",
  4: "Predictable revenue starts with predictable marketing. The shift from 'doing marketing' to 'running a marketing system' is what separates companies that grow reactively from those that grow by design.",
  5: "The best time to build for scale is before you need it. The constraints you're tolerating today will become the crises you're managing at 2x. Addressing them now is the leverage play.",
};

const TIER_CTAS: Record<string, string> = {
  'Optimized': 'Your next constraint is probably talent density or market reach — not operations.',
  'Scale-Ready': 'The highest-leverage move at this stage is identifying the one system that\'s lagging and closing the gap before it becomes a constraint.',
  'At the Ceiling': 'The ceiling isn\'t revenue — it\'s repeatability. Until the process exists independent of the person, you\'re capped.',
  'Leaking Revenue': 'The math is simple: if your close rate improves by 10 points, or your team reclaims 10 hours a week, what does that compound to over 12 months?',
  'Reactive Mode': 'The first 90 days of systematizing always feel slow. The next 90 feel like you installed a second team.',
  'Start Here': 'The fastest path to sustainable growth isn\'t more leads. It\'s building the infrastructure to convert the ones you already have.',
};

export async function POST(req: NextRequest) {
  try {
    const { name, email, answers } = await req.json() as {
      name: string;
      email: string;
      answers: number[];
    };

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const pdfServiceUrl = process.env.PDF_SERVICE_URL;
    if (!pdfServiceUrl) {
      return NextResponse.json({ error: 'PDF service not configured' }, { status: 500 });
    }

    // Call the Railway PDF service
    const pdfRes = await fetch(`${pdfServiceUrl}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-PDF-Secret': process.env.PDF_SERVICE_SECRET ?? '',
      },
      body: JSON.stringify({ name: name || '', email, answers }),
    });

    if (!pdfRes.ok) {
      const err = await pdfRes.text();
      console.error('[audit-submit] PDF service error:', err);
      return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 });
    }

    const pyResult = await pdfRes.json() as {
      total_score: number;
      tier_label: string;
      tier_insight: string;
      cat_scores: number[];
      priority_idx: number;
      pdf_b64: string;
    };

    const { total_score, tier_label, tier_insight, cat_scores, priority_idx, pdf_b64 } = pyResult;
    const pdfBuffer = Buffer.from(pdf_b64, 'base64');
    const priorityCategory = CATEGORY_LABELS[priority_idx] ?? 'Systems';
    const priorityInsight = PRIORITY_INSIGHTS[priority_idx] ?? '';
    const tierCta = TIER_CTAS[tier_label] ?? '';

    // Category scores table rows
    const catRows = CATEGORY_LABELS.map((label, i) => {
      const score = cat_scores[i] ?? 0;
      const pct = Math.round((score / 16) * 100);
      const isWorst = i === priority_idx;
      const barColor = pct >= 75 ? '#3B6D11' : pct >= 50 ? '#185FA5' : pct >= 25 ? '#E8721A' : '#A32D2D';
      return `
        <tr>
          <td style="padding:8px 0;font-size:13px;color:${isWorst ? '#ffffff' : '#aaa'};font-weight:${isWorst ? '600' : '400'};">
            ${isWorst ? '▲ ' : ''}${label}
          </td>
          <td style="padding:8px 0;text-align:right;font-size:13px;color:${barColor};font-weight:600;">${score}/16</td>
        </tr>
        <tr>
          <td colspan="2" style="padding:0 0 10px;">
            <div style="height:4px;background:rgba(255,255,255,0.06);border-radius:2px;">
              <div style="height:4px;width:${pct}%;background:${barColor};border-radius:2px;"></div>
            </div>
          </td>
        </tr>`;
    }).join('');

    // Save to Supabase
    await supabase.from('audit_results').insert({
      name: name || null,
      email,
      answers,
      cat_scores,
      total_score,
      tier_label,
      tier_insight,
      priority_idx,
    });

    // Send email via Resend with PDF attachment
    const { error: resendError } = await resend.emails.send({
      from: 'Andrew Mindy <contact@andrewmindy.com>',
      to: email,
      subject: `Your Growth Brief — ${total_score}/96 (${tier_label})`,
      html: `
        <div style="background:#0a0a0a;color:#ededed;font-family:'Helvetica Neue',Arial,sans-serif;padding:48px 32px;max-width:600px;margin:0 auto;border-radius:12px;">

          <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.25em;color:#66B3FF;margin:0 0 24px;">The Growth Brief</p>

          <h1 style="font-size:32px;font-weight:700;margin:0 0 8px;color:#ffffff;line-height:1.2;">
            ${name ? `${name}, here` : 'Here'}'s where you stand.
          </h1>
          <p style="font-size:15px;color:#666;margin:0 0 36px;">Your personalized Growth Brief is attached as a PDF.</p>

          <!-- Score + tier block -->
          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:28px;margin-bottom:24px;">
            <div style="margin-bottom:16px;">
              <span style="font-size:56px;font-weight:700;color:#ffffff;line-height:1;">${total_score}</span>
              <span style="font-size:18px;color:#555;margin-left:4px;">/96</span>
            </div>
            <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:#66B3FF;margin:0 0 10px;">${tier_label}</p>
            <p style="font-size:14px;color:#999;line-height:1.65;margin:0 0 14px;">${tier_insight}</p>
            <p style="font-size:13px;color:#666;font-style:italic;margin:0;border-top:1px solid rgba(255,255,255,0.06);padding-top:14px;">${tierCta}</p>
          </div>

          <!-- Category scores -->
          <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:24px;margin-bottom:24px;">
            <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:#555;margin:0 0 16px;">Score Breakdown</p>
            <table style="width:100%;border-collapse:collapse;">
              ${catRows}
            </table>
          </div>

          <!-- Priority focus -->
          <div style="background:rgba(102,179,255,0.06);border:1px solid rgba(102,179,255,0.18);border-radius:10px;padding:24px;margin-bottom:32px;">
            <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:#66B3FF;margin:0 0 8px;">Priority Focus</p>
            <p style="font-size:16px;font-weight:600;color:#ffffff;margin:0 0 12px;">${priorityCategory}</p>
            <p style="font-size:13px;color:#aaa;line-height:1.65;margin:0;">${priorityInsight}</p>
          </div>

          <!-- CTA button -->
          <a href="https://calendly.com/andrewmindy-info/30min"
            style="display:inline-block;background:#66B3FF;color:#050505;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;padding:15px 30px;border-radius:4px;text-decoration:none;margin-bottom:36px;">
            Book a Free 30-Min Review →
          </a>

          <!-- Footer -->
          <p style="font-size:12px;color:#444;margin:0;border-top:1px solid rgba(255,255,255,0.06);padding-top:24px;">
            Your full Growth Brief is attached as a PDF. Questions? Reply directly to this email.
          </p>

        </div>
      `,
      attachments: [
        {
          filename: 'growth-brief-results.pdf',
          content: pdfBuffer,
        },
      ],
    });

    if (resendError) {
      console.error('[audit-submit] Resend error:', resendError);
    }

    // Add to Resend Audience/Contacts
    if (process.env.RESEND_AUDIENCE_ID) {
      const { error: audienceError } = await resend.contacts.create({
        email,
        firstName: name ? name.split(' ')[0] : undefined,
        lastName: name && name.split(' ').length > 1 ? name.split(' ').slice(1).join(' ') : undefined,
        unsubscribed: false,
        audienceId: process.env.RESEND_AUDIENCE_ID,
      });

      if (audienceError) {
        console.error('[audit-submit] Resend audience error:', audienceError);
      }
    }

    return NextResponse.json({
      success: true,
      result: {
        total_score,
        tier_label,
        tier_insight,
        cat_scores,
        priority_idx,
      },
    });
  } catch (err) {
    console.error('[audit-submit]', err);
    return NextResponse.json(
      { error: 'Submission failed. Please try again.' },
      { status: 500 }
    );
  }
}
