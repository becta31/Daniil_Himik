import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

const SYSTEM_PROMPT = `Ты ИИ-ассистент ХИМИК — помощник по изучению химии. Отвечай на русском языке.

Твоя задача:
- Помогать изучать периодическую таблицу Менделеева
- Объяснять химические элементы, их свойства и применение
- Отвечать на вопросы по химии простым и понятным языком
- Давать интересные факты о химических элементах
- Помогать с домашними заданиями по химии

Отвечай кратко и по делу, используй эмодзи для наглядности.`;

let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    const zai = await getZAI();

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: SYSTEM_PROMPT },
        ...messages
      ],
      thinking: { type: 'disabled' }
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      return NextResponse.json({ error: 'Empty response from AI' }, { status: 500 });
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ 
      error: 'Произошла ошибка. Попробуйте ещё раз.' 
    }, { status: 500 });
  }
}
