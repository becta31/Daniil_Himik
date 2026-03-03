import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Ты ИИ-ассистент ХИМИК — помощник по изучению химии. Отвечай на русском языке.

Твоя задача:
- Помогать изучать периодическую таблицу Менделеева
- Объяснять химические элементы, их свойства и применение
- Отвечать на вопросы по химии простым и понятным языком
- Давать интересные факты о химических элементах
- Помогать с домашними заданиями по химии

Отвечай кратко и по делу, используй эмодзи для наглядности.`;

// Динамический импорт SDK
async function getZAI() {
  const ZAI = (await import('z-ai-web-dev-sdk')).default;
  
  // На Vercel используем переменные окружения
  const baseUrl = process.env.Z_AI_BASE_URL;
  const apiKey = process.env.Z_AI_API_KEY;
  
  if (baseUrl && apiKey) {
    return new ZAI({ baseUrl, apiKey });
  }
  
  // Локально используем конфиг файл
  return await ZAI.create();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    const zai = await getZAI();

    // Формируем сообщения для API
    const apiMessages = [
      { role: 'assistant' as const, content: SYSTEM_PROMPT },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }))
    ];

    const completion = await zai.chat.completions.create({
      messages: apiMessages,
      thinking: { type: 'disabled' }
    });

    const response = completion.choices?.[0]?.message?.content;

    if (!response) {
      console.error('Empty response, completion:', completion);
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
