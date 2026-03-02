import mongoose from 'mongoose';

// Схема элемента периодической таблицы
const ElementSchema = new mongoose.Schema({
  atomicNumber: { type: Number, required: true, unique: true },
  symbol: { type: String, required: true, unique: true },
  nameRu: { type: String, required: true },
  nameEn: { type: String, required: true },
  mass: { type: Number, required: true },
  category: { type: String, required: true },
  period: { type: Number, required: true },
  group: { type: Number, required: true },
  electronConfiguration: { type: String, required: true },
  description: { type: String, required: true },
}, { 
  timestamps: true,
  collection: 'elements'
});

// Схема результата викторины
const QuizResultSchema = new mongoose.Schema({
  playerName: { type: String, required: true },
  score: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  timeSpent: { type: Number, default: 0 },
}, { 
  timestamps: true,
  collection: 'quizresults'
});

// Динамический импорт connectDB для избежания ошибки при отсутствии MONGODB_URI
async function getMongoConnection() {
  const { connectDB } = await import('./mongodb');
  return connectDB();
}

// Функция для получения моделей с подключением
export async function getModels() {
  await getMongoConnection();
  
  const Element = mongoose.models.Element || mongoose.model('Element', ElementSchema);
  const QuizResult = mongoose.models.QuizResult || mongoose.model('QuizResult', QuizResultSchema);
  
  return { Element, QuizResult };
}

// Экспорт типов
export interface IElement extends mongoose.Document {
  atomicNumber: number;
  symbol: string;
  nameRu: string;
  nameEn: string;
  mass: number;
  category: string;
  period: number;
  group: number;
  electronConfiguration: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuizResult extends mongoose.Document {
  playerName: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  createdAt: Date;
  updatedAt: Date;
}
