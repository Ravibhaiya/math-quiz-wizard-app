
import { Question, QuizSettings } from "@/types/quiz";

// Helper function to generate a random fraction
const generateRandomFraction = (maxDenominator: number): [number, number] => {
  const denominator = Math.floor(Math.random() * maxDenominator) + 1;
  const numerator = Math.floor(Math.random() * denominator) + 1;
  return [numerator, denominator];
};

// Helper function to reduce a fraction to its simplest form
const reduceFraction = (numerator: number, denominator: number): [number, number] => {
  const gcd = (a: number, b: number): number => {
    return b ? gcd(b, a % b) : a;
  };
  
  const divisor = gcd(numerator, denominator);
  return [numerator / divisor, denominator / divisor];
};

// Generate questions for percentage quiz
export const generatePercentageQuestions = (settings: QuizSettings): Question[] => {
  const { questionCount = 10, maxDenominator = 10, reverseMode = false } = settings;
  const questions: Question[] = [];

  for (let i = 0; i < questionCount; i++) {
    const [numerator, denominator] = generateRandomFraction(maxDenominator);
    const percentageValue = (numerator / denominator) * 100;
    
    // Round to 2 decimal places for correct answer
    const roundedPercentage = Math.round(percentageValue * 100) / 100;
    
    let question: Question;
    
    if (reverseMode) {
      // Fraction to percentage
      const [reducedNumerator, reducedDenominator] = reduceFraction(numerator, denominator);
      question = {
        id: i + 1,
        question: `${reducedNumerator}/${reducedDenominator}`,
        correctAnswer: roundedPercentage,
        startTime: Date.now(),
        isPercentageQuestion: true
      };
    } else {
      // Percentage to fraction
      const [reducedNumerator, reducedDenominator] = reduceFraction(numerator, denominator);
      question = {
        id: i + 1,
        question: `${roundedPercentage}%`,
        // Store as decimal for calculation (e.g., 0.5 for 1/2)
        correctAnswer: reducedNumerator / reducedDenominator,
        startTime: Date.now(),
        isPercentageQuestion: false
      };
    }
    
    questions.push(question);
  }

  return questions;
};
