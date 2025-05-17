import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

interface EmailListFormProps {
  onSubmit?: (data: { name: string; emails: string[] }) => void;
  initialData?: {
    name: string;
    emails: string[];
  };
}

export default function EmailListForm({ onSubmit, initialData }: EmailListFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [emailsText, setEmailsText] = useState(initialData?.emails.join('\n') || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim()) {
      setError('Please enter a list name');
      return;
    }

    // Parse and validate emails
    const emails = emailsText
      .split('\n')
      .map(email => email.trim())
      .filter(email => email.length > 0);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emails.filter(email => !emailRegex.test(email));

    if (invalidEmails.length > 0) {
      setError(`Invalid email(s): ${invalidEmails.join(', ')}`);
      return;
    }

    if (emails.length === 0) {
      setError('Please enter at least one email address');
      return;
    }

    setError(null);
    onSubmit?.({ name, emails });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">List Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Tech Companies SF"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="emails">Email Addresses</Label>
        <Textarea
          id="emails"
          value={emailsText}
          onChange={(e) => setEmailsText(e.target.value)}
          placeholder="Enter one email address per line"
          rows={10}
          required
        />
        <p className="text-sm text-muted-foreground">
          Enter one email address per line
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <Button type="submit" className="w-full">
        {initialData ? 'Update Email List' : 'Create Email List'}
      </Button>
    </form>
  );
}