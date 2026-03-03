import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Ты ИИ-ассистент ХИМИК — помощник по изучению химии. Отвечай на русском языке.

Твоя задача:
- Помогать изучать периодическую таблицу Менделеева
- Объяснять химические элементы, их свойства и применение
- Отвечать на вопросы по химии простым и понятным языком
- Давать интересные факты о химических элементах
- Помогать с домашними заданиями по химии

Отвечай кратко и по делу, используй эмодзи для наглядности.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    const baseUrl = process.env.Z_AI_BASE_URL;
    const apiKey = process.env.Z_AI_API_KEY;

    if (!baseUrl || !apiKey) {
      console.error('Missing Z_AI_BASE_URL or Z_AI_API_KEY');
      return NextResponse.json({ 
        error: 'ИИ-помощник не настроен. Добавьте Z_AI_BASE_URL и Z_AI_API_KEY в переменные окружения.' 
      }, { status: 500 });
    }

    // Формируем сообщения для API
    const apiMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content
      }))
    ];

    console.log('Calling API:', baseUrl);
    console.log('Messages:', JSON.stringify(apiMessages, null, 2));

    // Прямой вызов API
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'glm-4-plus',
        messages: apiMessages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error:', response.status, errorText);
      return NextResponse.json({ 
        error: `Ошибка API: ${response.status}` 
      }, { status: 500 });
    }

    const data = await response.json();
    console.log('API response:', JSON.stringify(data, null, 2));

    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('No content in response:', data);
      return NextResponse.json({ error: 'Empty response from AI' }, { status: 500 });
    }

    return NextResponse.json({ response: content });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ 
      error: 'Произошла ошибка. Попробуйте ещё раз.' 
    }, { status: 500 });
  }
}
