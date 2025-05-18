import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface CandidateFormProps {
  id?: string;
  initialData?: {
    name: string;
    date_of_birth: string;
    language_level: string;
  };
}

const LANGUAGE_LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Native"
];

export default function CandidateForm({ id, initialData }: CandidateFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [dateOfBirth, setDateOfBirth] = useState(initialData?.date_of_birth || '');
  const [languageLevel, setLanguageLevel] = useState(initialData?.language_level || LANGUAGE_LEVELS[0]);
  const [passport, setPassport] = useState<File | null>(null);
  const [cv, setCv] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Basic validation
      if (!name.trim()) throw new Error('Please enter a name');
      if (!dateOfBirth) throw new Error('Please enter date of birth');
      if (!languageLevel) throw new Error('Please select language level');
      if (!id && (!passport || !cv)) throw new Error('Please upload both passport and CV');

      // Handle file uploads first if needed
      let passportUrl = initialData?.passport_url;
      let cvUrl = initialData?.cv_url;

      if (passport) {
        const passportPath = `passports/${Date.now()}-${passport.name}`;
        const { error: passportError } = await supabase.storage
          .from('documents')
          .upload(passportPath, passport);
        
        if (passportError) throw passportError;
        passportUrl = passportPath;
      }

      if (cv) {
        const cvPath = `cvs/${Date.now()}-${cv.name}`;
        const { error: cvError } = await supabase.storage
          .from('documents')
          .upload(cvPath, cv);
        
        if (cvError) throw cvError;
        cvUrl = cvPath;
      }

      // Update or create the candidate
      const { error: supabaseError } = id
        ? await supabase
            .from('candidates')
            .update({
              name,
              date_of_birth: dateOfBirth,
              language_level: languageLevel,
              ...(passportUrl && { passport_url: passportUrl }),
              ...(cvUrl && { cv_url: cvUrl })
            })
            .eq('id', id)
        : await supabase
            .from('candidates')
            .insert([{
              name,
              date_of_birth: dateOfBirth,
              language_level: languageLevel,
              passport_url: passportUrl,
              cv_url: cvUrl
            }]);

      if (supabaseError) throw supabaseError;

      toast({
        title: id ? "Candidate updated" : "Candidate created",
        description: `Successfully ${id ? 'updated' : 'created'} candidate "${name}"`,
      });

      router.push('/candidates');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const { error: deleteError } = await supabase
        .from('candidates')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      toast({
        title: "Candidate deleted",
        description: `Successfully deleted candidate "${name}"`,
      });

      router.push('/candidates');
      router.refresh();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete candidate",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="languageLevel">Language Level</Label>
        <Select value={languageLevel} onValueChange={setLanguageLevel} disabled={isLoading}>
          <SelectTrigger>
            <SelectValue placeholder="Select language level" />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGE_LEVELS.map(level => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="passport">Passport (PDF)</Label>
        <Input
          id="passport"
          type="file"
          accept=".pdf"
          onChange={(e) => setPassport(e.target.files?.[0] || null)}
          disabled={isLoading}
          {...(!id && { required: true })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cv">CV (PDF)</Label>
        <Input
          id="cv"
          type="file"
          accept=".pdf"
          onChange={(e) => setCv(e.target.files?.[0] || null)}
          disabled={isLoading}
          {...(!id && { required: true })}
        />
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="flex gap-4">
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? (id ? "Updating..." : "Creating...") : (id ? 'Update Candidate' : 'Create Candidate')}
        </Button>

        {id && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isLoading}>Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the candidate
                  and remove them from any campaigns.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </form>
  );
}