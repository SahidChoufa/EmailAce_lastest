import { NextResponse } from 'next/server';
import { generateEmailDraft } from '@/ai/flows/generate-email-draft';
import type { GenerateEmailDraftInput } from '@/ai/flows/generate-email-draft';

export async function POST(request: Request) {
  try {
    const body: GenerateEmailDraftInput = await request.json();
    
    const result = await generateEmailDraft(body);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating email draft:', error);
    return NextResponse.json(
      { error: 'Failed to generate email draft' },
      { status: 500 }
    );
  }
}