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

    const formattedMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role,
      content: m.content
    }));

    // 1. Groq API (бесплатно)
    const groqApiKey = process.env.GROQ_API_KEY;
    if (groqApiKey) {
      console.log('Trying Groq API...');
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              ...formattedMessages
            ],
            max_tokens: 500,
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            console.log('Groq API success');
            return NextResponse.json({ response: content });
          }
        }
        console.log('Groq API failed, trying next...');
      } catch (e) {
        console.log('Groq API error:', e);
      }
    }

    // 2. Hugging Face Inference API
    const hfApiKey = process.env.HUGGINGFACE_API_KEY;
    if (hfApiKey) {
      console.log('Trying Hugging Face API...');
      
      // Список моделей для попытки
      const models = [
        'Qwen/Qwen2.5-7B-Instruct',
        'Qwen/Qwen2.5-3B-Instruct',
        'microsoft/Phi-3-mini-4k-instruct',
      ];

      for (const model of models) {
        try {
          console.log(`Trying model: ${model}`);
          
          const response = await fetch(
            `https://api-inference.huggingface.co/models/${model}/v1/chat/completions`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${hfApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: model,
                messages: [
                  { role: 'system', content: SYSTEM_PROMPT },
                  ...formattedMessages
                ],
                max_tokens: 500,
                temperature: 0.7,
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            const content = data.choices?.[0]?.message?.content;
            if (content) {
              console.log(`Hugging Face success with ${model}`);
              return NextResponse.json({ response: content });
            }
          }
        } catch (e) {
          console.log(`Model ${model} failed:`, e);
        }
      }
    }

    // 3. Fallback - Z.ai (локально)
    const baseUrl = process.env.Z_AI_BASE_URL;
    const zApiKey = process.env.Z_AI_API_KEY;

    if (baseUrl && zApiKey) {
      console.log('Trying Z.ai API...');
      try {
        const response = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${zApiKey}`,
          },
          body: JSON.stringify({
            model: 'glm-4-plus',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              ...formattedMessages
            ],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            console.log('Z.ai API success');
            return NextResponse.json({ response: content });
          }
        }
      } catch (e) {
        console.log('Z.ai API error:', e);
      }
    }

    return NextResponse.json({ 
      error: 'ИИ-помощник не настроен. Добавьте GROQ_API_KEY или HUGGINGFACE_API_KEY в переменные окружения.' 
    }, { status: 500 });

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ 
      error: 'Произошла ошибка. Попробуйте ещё раз.' 
    }, { status: 500 });
  }
}
