import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getModels } from '@/lib/models';

// Проверяем, используем ли MongoDB
const useMongoDB = !!process.env.MONGODB_URI;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerName, score, correctAnswers, totalQuestions, timeSpent } = body;
    
    if (!playerName || typeof score !== 'number') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    if (useMongoDB) {
      // MongoDB (Vercel)
      const { QuizResult } = await getModels();
      const result = await QuizResult.create({
        playerName,
        score,
        correctAnswers,
        totalQuestions,
        timeSpent: timeSpent || 0,
      });
      
      return NextResponse.json({
        id: result._id.toString(),
        playerName: result.playerName,
        score: result.score,
        correctAnswers: result.correctAnswers,
        totalQuestions: result.totalQuestions,
        timeSpent: result.timeSpent,
        createdAt: result.createdAt,
      });
    } else {
      // Prisma/SQLite (локально)
      const result = await db.quizResult.create({ 
        data: {
          playerName,
          score,
          correctAnswers,
          totalQuestions,
          timeSpent: timeSpent || 0,
        }
      });
      
      return NextResponse.json(result);
    }
  } catch (error) {
    console.error('Error submitting quiz result:', error);
    return NextResponse.json({ error: 'Failed to submit quiz result' }, { status: 500 });
  }
}
