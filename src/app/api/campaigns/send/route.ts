import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { supabase } from '@/lib/supabase';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD, // Use app-specific password
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { campaignId, recipientEmail, subject, content } = body;

    // Send email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: subject,
      text: content,
    });

    // Update sent_emails status
    await supabase
      .from('sent_emails')
      .update({ status: 'delivered', sent_at: new Date().toISOString() })
      .eq('campaign_id', campaignId)
      .eq('recipient_email', recipientEmail);

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}