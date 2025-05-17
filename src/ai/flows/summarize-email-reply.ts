'use server';

/**
 * @fileOverview Summarizes email replies and categorizes them into 'Yes', 'No', or 'Other'.
 *
 * - summarizeEmailReply - A function that summarizes an email reply and categorizes it.
 * - SummarizeEmailReplyInput - The input type for the summarizeEmailReply function.
 * - SummarizeEmailReplyOutput - The return type for the summarizeEmailReply function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeEmailReplyInputSchema = z.object({
  emailReply: z
    .string()
    .describe('The content of the email reply to be summarized.'),
});
export type SummarizeEmailReplyInput = z.infer<typeof SummarizeEmailReplyInputSchema>;

const SummarizeEmailReplyOutputSchema = z.object({
  summary: z.string().describe('A short summary of the email reply.'),
  category: z.enum(['Yes', 'No', 'Other']).describe("The category of the email reply, chosen from 'Yes', 'No', or 'Other'."),
});
export type SummarizeEmailReplyOutput = z.infer<typeof SummarizeEmailReplyOutputSchema>;

export async function summarizeEmailReply(input: SummarizeEmailReplyInput): Promise<SummarizeEmailReplyOutput> {
  return summarizeEmailReplyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeEmailReplyPrompt',
  input: {schema: SummarizeEmailReplyInputSchema},
  output: {schema: SummarizeEmailReplyOutputSchema},
  prompt: `You are an AI assistant helping to categorize email replies.
  Based on the content of the email reply, provide a short summary and categorize it as either 'Yes', 'No', or 'Other'.
  'Yes' indicates the recipient is interested.
  'No' indicates the recipient is not interested.
  'Other' includes automated replies or unclear answers.

  Email Reply: {{{emailReply}}}

  Summary: 
  Category:`, // The category MUST be one of 'Yes', 'No', or 'Other'
});

const summarizeEmailReplyFlow = ai.defineFlow(
  {
    name: 'summarizeEmailReplyFlow',
    inputSchema: SummarizeEmailReplyInputSchema,
    outputSchema: SummarizeEmailReplyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
