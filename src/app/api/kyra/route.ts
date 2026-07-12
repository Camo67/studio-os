import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;

    const response = {
      id: Date.now().toString(),
      message: `I understand you want to: "${message}". I'm Kyra, your AI assistant. I can help you with:
      
1. Creating drafts for emails or documents
2. Summarizing recent activity
3. Suggesting next actions based on your pipeline
4. Answering questions about your studio data

For now, this is a mock response. Connect me to an LLM API to unlock my full potential!`,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}