
export type QuizType = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'percentage';

export interface QuizSettings {
  questionCount: number;
  numDigits?: number;
  terms?: number;
  includeFraction?: boolean;
  includeDecimal?: boolean;
  reverseMode?: boolean;
  maxDenominator?: number;
}

export interface Question {
  id: number;
  question: string;
  correctAnswer: number;
  userAnswer?: number | null;
  startTime: number;
  endTime?: number;
  isPercentageQuestion?: boolean;
}

export interface QuizResults {
  type: QuizType;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  averageTime: number;
  questions: Question[];
}
