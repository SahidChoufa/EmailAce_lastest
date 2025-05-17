/*
  # Initial Schema for EmailAce

  1. New Tables
    - candidates
      - id (uuid, primary key)
      - name (text)
      - date_of_birth (date)
      - passport_url (text)
      - cv_url (text)
      - language_level (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)
      - user_id (uuid, foreign key)

    - email_lists
      - id (uuid, primary key)
      - name (text)
      - emails (text[])
      - created_at (timestamptz)
      - updated_at (timestamptz)
      - user_id (uuid, foreign key)

    - email_templates
      - id (uuid, primary key)
      - name (text)
      - subject_template (text)
      - body_template (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)
      - user_id (uuid, foreign key)

    - campaigns
      - id (uuid, primary key)
      - name (text)
      - candidate_id (uuid, foreign key)
      - email_list_id (uuid, foreign key)
      - template_id (uuid, foreign key)
      - status (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)
      - user_id (uuid, foreign key)

    - sent_emails
      - id (uuid, primary key)
      - campaign_id (uuid, foreign key)
      - recipient_email (text)
      - sent_at (timestamptz)
      - status (text)
      - reply_received_at (timestamptz)
      - reply_category (text)
      - reply_summary (text)
      - error_message (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create candidates table
CREATE TABLE candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  date_of_birth date NOT NULL,
  passport_url text,
  cv_url text,
  language_level text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create email_lists table
CREATE TABLE email_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  emails text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create email_templates table
CREATE TABLE email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subject_template text NOT NULL,
  body_template text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create campaigns table
CREATE TABLE campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE,
  email_list_id uuid REFERENCES email_lists(id) ON DELETE CASCADE,
  template_id uuid REFERENCES email_templates(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create sent_emails table
CREATE TABLE sent_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE,
  recipient_email text NOT NULL,
  sent_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'pending',
  reply_received_at timestamptz,
  reply_category text,
  reply_summary text,
  error_message text
);

-- Enable Row Level Security
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE sent_emails ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own candidates"
  ON candidates
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own email lists"
  ON email_lists
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own templates"
  ON email_templates
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own campaigns"
  ON campaigns
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view sent emails for their campaigns"
  ON sent_emails
  USING (EXISTS (
    SELECT 1 FROM campaigns 
    WHERE campaigns.id = sent_emails.campaign_id 
    AND campaigns.user_id = auth.uid()
  ));

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_candidates_updated_at
  BEFORE UPDATE ON candidates
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_email_lists_updated_at
  BEFORE UPDATE ON email_lists
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON email_templates
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();