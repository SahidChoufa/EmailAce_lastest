import { NextResponse } from 'next/server';
import { summarizeEmailReply } from '@/ai/flows/summarize-email-reply';
import type { SummarizeEmailReplyInput } from '@/ai/flows/summarize-email-reply';

export async function POST(request: Request) {
  try {
    const body: SummarizeEmailReplyInput = await request.json();
    
    const result = await summarizeEmailReply(body);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error summarizing email reply:', error);
    return NextResponse.json(
      { error: 'Failed to summarize email reply' },
      { status: 500 }
    );
  }
}