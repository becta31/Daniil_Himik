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

    // Hugging Face API
    const hfApiKey = process.env.HUGGINGFACE_API_KEY;
    
    if (hfApiKey) {
      // Получаем последнее сообщение пользователя
      const lastUserMessage = messages.filter((m: { role: string }) => m.role === 'user').pop();
      
      // Формируем промпт для Qwen модели
      const prompt = `<|im_start|>system
${SYSTEM_PROMPT}<|im_end|>
<|im_start|>user
${lastUserMessage?.content}<|im_end|>
<|im_start|>assistant
`;

      console.log('Calling Hugging Face Inference API...');
      
      // Пробуем разные модели
      const models = [
        'Qwen/Qwen2.5-7B-Instruct',
        'Qwen/Qwen3-4B-Instruct-2507',
      ];

      for (const model of models) {
        try {
          const response = await fetch(
            `https://router.huggingface.co/hf-inference/models/${model}`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${hfApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                inputs: prompt,
                parameters: {
                  max_new_tokens: 500,
                  temperature: 0.7,
                  return_full_text: false,
                },
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            console.log('HF response from', model, ':', JSON.stringify(data, null, 2));

            const content = Array.isArray(data) 
              ? data[0]?.generated_text 
              : data.generated_text;
            
            if (content) {
              const cleanContent = content
                .replace(/<\|im_end\|>/g, '')
                .replace(/<\|im_start\|>/g, '')
                .trim();
              return NextResponse.json({ response: cleanContent });
            }
          } else {
            console.log(`Model ${model} failed:`, response.status);
          }
        } catch (e) {
          console.log(`Model ${model} error:`, e);
        }
      }
    }

    // Fallback - Z.ai (локально)
    const baseUrl = process.env.Z_AI_BASE_URL;
    const apiKey = process.env.Z_AI_API_KEY;

    if (baseUrl && apiKey) {
      const apiMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content
        }))
      ];

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

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          return NextResponse.json({ response: content });
        }
      }
    }

    return NextResponse.json({ 
      error: 'ИИ-помощник не настроен или модели недоступны. Проверьте HUGGINGFACE_API_KEY.' 
    }, { status: 500 });

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ 
      error: 'Произошла ошибка. Попробуйте ещё раз.' 
    }, { status: 500 });
  }
}
