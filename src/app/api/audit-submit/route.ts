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
      subject: `Your Scale Audit Results — ${total_score}/96 (${tier_label})`,
      html: `
        <div style="background:#0a0a0a;color:#ededed;font-family:'Helvetica Neue',Arial,sans-serif;padding:48px 32px;max-width:600px;margin:0 auto;border-radius:12px;">
          <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.25em;color:#62AFEF;margin:0 0 24px;">The Scale Audit</p>

          <h1 style="font-size:36px;font-weight:700;margin:0 0 8px;color:#ffffff;">
            ${name ? `${name}, here` : 'Here'}'s where you stand.
          </h1>

          <p style="font-size:16px;color:#888;margin:0 0 40px;">Your personalized audit results are attached.</p>

          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:32px;margin-bottom:32px;">
            <div style="display:flex;align-items:baseline;gap:12px;margin-bottom:16px;">
              <span style="font-size:52px;font-weight:700;color:#ffffff;line-height:1;">${total_score}</span>
              <span style="font-size:20px;color:#888;">/96</span>
            </div>
            <p style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#62AFEF;margin:0 0 8px;">${tier_label}</p>
            <p style="font-size:15px;color:#aaa;line-height:1.6;margin:0;">${tier_insight}</p>
          </div>

          <div style="background:rgba(98,175,239,0.08);border:1px solid rgba(98,175,239,0.2);border-radius:8px;padding:24px;margin-bottom:40px;">
            <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;color:#62AFEF;margin:0 0 8px;">Priority Focus</p>
            <p style="font-size:18px;font-weight:600;color:#ffffff;margin:0;">${priorityCategory}</p>
          </div>

          <a href="https://calendly.com/andrewmindy-info/30min"
            style="display:inline-block;background:#62AFEF;color:#050505;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;padding:16px 32px;border-radius:4px;text-decoration:none;margin-bottom:40px;">
            Book a Free Strategy Call →
          </a>

          <p style="font-size:13px;color:#555;margin:0;">
            Your full report is attached as a PDF. Questions? Reply to this email.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: 'scale-audit-results.pdf',
          content: pdfBuffer,
        },
      ],
    });

    if (resendError) {
      console.error('[audit-submit] Resend error:', resendError);
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
