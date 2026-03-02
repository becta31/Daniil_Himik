import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getModels } from '@/lib/models';

// Проверяем, используем ли MongoDB
const useMongoDB = !!process.env.MONGODB_URI;

export async function GET() {
  try {
    if (useMongoDB) {
      // MongoDB (Vercel)
      const { QuizResult } = await getModels();
      const results = await QuizResult.find({})
        .sort({ score: -1, timeSpent: 1 })
        .limit(50)
        .lean();
      
      // Преобразуем _id в id для совместимости
      const formattedResults = results.map((r: any) => ({
        id: r._id.toString(),
        playerName: r.playerName,
        score: r.score,
        correctAnswers: r.correctAnswers,
        totalQuestions: r.totalQuestions,
        timeSpent: r.timeSpent,
        createdAt: r.createdAt,
      }));
      
      return NextResponse.json(formattedResults);
    } else {
      // Prisma/SQLite (локально)
      const results = await db.quizResult.findMany({
        orderBy: [{ score: 'desc' }, { timeSpent: 'asc' }],
        take: 50,
      });
      return NextResponse.json(results);
    }
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    return NextResponse.json({ error: 'Failed to fetch quiz results' }, { status: 500 });
  }
}
