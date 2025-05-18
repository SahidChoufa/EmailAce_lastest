/*
  # Add campaign fields and sent emails tracking

  1. Changes
    - Add job_description column to campaigns table
    - Add status column to campaigns table with valid states
    - Add sent_emails table for tracking email delivery

  2. Security
    - Enable RLS on sent_emails table
    - Add policies for authenticated users
*/

-- Add job_description to campaigns
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS job_description text;

-- Add status enum type
DO $$ BEGIN
  CREATE TYPE campaign_status AS ENUM ('draft', 'sending', 'sent', 'failed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add status column with default
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS status campaign_status DEFAULT 'draft';

-- Create sent_emails table if it doesn't exist
CREATE TABLE IF NOT EXISTS sent_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE,
  recipient_email text NOT NULL,
  sent_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'pending',
  reply_received_at timestamptz,
  reply_category text,
  reply_summary text,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on sent_emails
ALTER TABLE sent_emails ENABLE ROW LEVEL SECURITY;

-- Add policy for sent_emails
CREATE POLICY "Users can view sent emails for their campaigns"
  ON sent_emails FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE campaigns.id = sent_emails.campaign_id 
      AND campaigns.user_id = auth.uid()
    )
  );