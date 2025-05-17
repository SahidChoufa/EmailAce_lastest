'use server';
/**
 * @fileOverview AI agent to generate personalized email drafts for job applications.
 *
 * - generateEmailDraft - A function that generates the email draft.
 * - GenerateEmailDraftInput - The input type for the generateEmailDraft function.
 * - GenerateEmailDraftOutput - The return type for the generateEmailDraft function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEmailDraftInputSchema = z.object({
  candidateName: z.string().describe("The candidate's full name."),
  candidateInformation: z.string().describe('Information about the candidate, such as skills and experience.'),
  jobDescription: z.string().describe('The job description for the position the candidate is applying for.'),
  emailTemplate: z.string().describe('The template for the email, with placeholders for personalization.'),
});
export type GenerateEmailDraftInput = z.infer<typeof GenerateEmailDraftInputSchema>;

const GenerateEmailDraftOutputSchema = z.object({
  emailDraft: z.string().describe('The personalized email draft.'),
});
export type GenerateEmailDraftOutput = z.infer<typeof GenerateEmailDraftOutputSchema>;

export async function generateEmailDraft(input: GenerateEmailDraftInput): Promise<GenerateEmailDraftOutput> {
  return generateEmailDraftFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEmailDraftPrompt',
  input: {schema: GenerateEmailDraftInputSchema},
  output: {schema: GenerateEmailDraftOutputSchema},
  prompt: `You are an AI assistant specializing in crafting personalized email drafts for job applications.

  Based on the candidate's information, the job description, and the provided email template, generate a personalized email draft.

  Candidate Name: {{{candidateName}}}
  Candidate Information: {{{candidateInformation}}}
  Job Description: {{{jobDescription}}}
  Email Template: {{{emailTemplate}}}

  Personalized Email Draft:`,
});

const generateEmailDraftFlow = ai.defineFlow(
  {
    name: 'generateEmailDraftFlow',
    inputSchema: GenerateEmailDraftInputSchema,
    outputSchema: GenerateEmailDraftOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
