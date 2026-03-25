import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, service, contactPref, message } = await req.json() as {
      name: string;
      email: string;
      phone?: string;
      subject?: string;
      service?: string;
      contactPref?: string;
      message: string;
    };

    if (!email || !message) {
      return NextResponse.json({ error: 'Email and message are required' }, { status: 400 });
    }

    const emailSubject = subject
      ? `[Contact] ${subject} — ${name || email}`
      : `New message from ${name || email}`;

    await resend.emails.send({
      from: 'Portfolio Contact <contact@andrewmindy.com>',
      to: 'contact@andrewmindy.com',
      replyTo: email,
      subject: emailSubject,
      html: `
        <div style="background:#0a0a0a;color:#ededed;font-family:'Helvetica Neue',Arial,sans-serif;padding:40px 32px;max-width:600px;margin:0 auto;border-radius:12px;">
          <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.25em;color:#66B3FF;margin:0 0 20px;">Contact Form Submission</p>
          <h2 style="font-size:22px;font-weight:700;margin:0 0 24px;color:#fff;">${emailSubject}</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            ${name ? `<tr><td style="padding:8px 0;color:#888;width:140px;">Name</td><td style="padding:8px 0;color:#fff;">${name}</td></tr>` : ''}
            <tr><td style="padding:8px 0;color:#888;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#66B3FF;">${email}</a></td></tr>
            ${phone ? `<tr><td style="padding:8px 0;color:#888;">Phone</td><td style="padding:8px 0;color:#fff;">${phone}</td></tr>` : ''}
            ${service ? `<tr><td style="padding:8px 0;color:#888;">Category</td><td style="padding:8px 0;color:#fff;">${service}</td></tr>` : ''}
            ${contactPref ? `<tr><td style="padding:8px 0;color:#888;">Preferred Contact</td><td style="padding:8px 0;color:#fff;text-transform:capitalize;">${contactPref}</td></tr>` : ''}
          </table>
          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:20px;margin-top:24px;">
            <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:#555;margin:0 0 12px;">Message</p>
            <p style="font-size:14px;color:#ccc;line-height:1.65;margin:0;">${message.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
      `,
    });

    // Add to Resend General Contact audience with properties
    if (process.env.RESEND_AUDIENCE_CONTACT_ID) {
      const { error: audienceError } = await resend.contacts.create({
        email,
        firstName: name ? name.split(' ')[0] : undefined,
        lastName: name && name.split(' ').length > 1 ? name.split(' ').slice(1).join(' ') : undefined,
        unsubscribed: false,
        audienceId: process.env.RESEND_AUDIENCE_CONTACT_ID,
        properties: {
          service_interest: service ?? '',
          contact_pref: contactPref ?? 'email',
          contact_date: new Date().toISOString().split('T')[0],
        },
      });

      if (audienceError) {
        console.error('[contact] Resend audience error:', audienceError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[contact]', err);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
