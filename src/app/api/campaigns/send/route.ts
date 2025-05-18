import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { supabase } from '@/lib/supabase';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Verify transporter configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('SMTP Configuration Error:', error);
  } else {
    console.log('SMTP Server is ready to send emails');
  }
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { campaignId, recipientEmail, subject, content } = body;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      console.error('Missing email configuration');
      throw new Error('Email configuration is missing');
    }

    console.log('Attempting to send email to:', recipientEmail);
    console.log('Using email configuration:', {
      from: process.env.EMAIL_USER,
      auth: process.env.EMAIL_APP_PASSWORD ? 'Password configured' : 'Password missing'
    });

    // Send email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: subject,
      text: content,
    });

    console.log('Email sent successfully:', info.messageId);

    // Update sent_emails status
    const { error: updateError } = await supabase
      .from('sent_emails')
      .update({ 
        status: 'delivered', 
        sent_at: new Date().toISOString() 
      })
      .eq('campaign_id', campaignId)
      .eq('recipient_email', recipientEmail);

    if (updateError) {
      console.error('Error updating sent_emails status:', updateError);
      throw updateError;
    }

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Detailed error sending email:', error);
    
    // Update sent_emails status to failed
    try {
      await supabase
        .from('sent_emails')
        .update({ 
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error'
        })
        .eq('campaign_id', campaignId)
        .eq('recipient_email', recipientEmail);
    } catch (updateError) {
      console.error('Error updating failure status:', updateError);
    }

    return NextResponse.json(
      { 
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}