"use client";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type CandidateFormProps = {
  onSubmit?: (data: FormData) => void;
};

const languageLevels = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Native",
];

export default function CandidateForm({ onSubmit }: CandidateFormProps) {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [passport, setPassport] = useState<File | null>(null);
  const [cv, setCv] = useState<File | null>(null);
  const [languageLevel, setLanguageLevel] = useState(languageLevels[0]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !dob || !passport || !cv) {
      setError("Please fill in all fields and upload both files.");
      return;
    }
    setError(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("dob", dob);
    formData.append("passport", passport);
    formData.append("cv", cv);
    formData.append("languageLevel", languageLevel);

    if (onSubmit) {
      onSubmit(formData);
    }
    
    toast({
      title: "Success",
      description: "Candidate has been created successfully",
    });
    
    router.push('/candidates');
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <label className="font-medium">
        Full Name
        <input
          type="text"
          className="input mt-1 w-full"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </label>

      <label className="font-medium">
        Date of Birth
        <input
          type="date"
          className="input mt-1 w-full"
          value={dob}
          onChange={e => setDob(e.target.value)}
          required
        />
      </label>

      <label className="font-medium">
        Passport (PDF)
        <input
          type="file"
          accept="application/pdf"
          className="input mt-1 w-full"
          onChange={e => setPassport(e.target.files?.[0] ?? null)}
          required
        />
      </label>

      <label className="font-medium">
        CV (PDF)
        <input
          type="file"
          accept="application/pdf"
          className="input mt-1 w-full"
          onChange={e => setCv(e.target.files?.[0] ?? null)}
          required
        />
      </label>

      <label className="font-medium">
        Language Level
        <select
          className="input mt-1 w-full"
          value={languageLevel}
          onChange={e => setLanguageLevel(e.target.value)}
        >
          {languageLevels.map(level => (
            <option value={level} key={level}>{level}</option>
          ))}
        </select>
      </label>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button type="submit" className="btn btn-primary mt-2">
        Add Candidate
      </button>
    </form>
  );
}