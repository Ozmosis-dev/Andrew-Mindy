import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json() as {
      name: string;
      email: string;
      message: string;
    };

    if (!email || !message) {
      return NextResponse.json({ error: 'Email and message are required' }, { status: 400 });
    }

    await resend.emails.send({
      from: 'Portfolio Contact <contact@andrewmindy.com>',
      to: 'contact@andrewmindy.com',
      replyTo: email,
      subject: `New message from ${name || email}`,
      html: `
        <p><strong>Name:</strong> ${name || '—'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

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
        console.error('[contact] Resend audience error:', audienceError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[contact]', err);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
