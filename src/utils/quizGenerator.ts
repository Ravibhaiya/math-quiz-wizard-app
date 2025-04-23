
import { QuizType, QuizSettings, Question } from '@/types/quiz';

// Helper function to generate a random number within a range
const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a number with specific number of digits
const generateNumberWithDigits = (digits: number): number => {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return getRandomNumber(min, max);
};

// Format the question based on the quiz type
const formatQuestion = (type: QuizType, numbers: number[]): string => {
  switch (type) {
    case 'addition':
      return numbers.join(' + ');
    case 'subtraction':
      return numbers.join(' - ');
    case 'multiplication':
      return numbers.join(' × ');
    case 'division':
      return numbers.join(' ÷ ');
    default:
      return '';
  }
};

// Calculate the correct answer
const calculateAnswer = (type: QuizType, numbers: number[]): number => {
  switch (type) {
    case 'addition':
      return numbers.reduce((sum, num) => sum + num, 0);
    case 'subtraction':
      return numbers.reduce((result, num, index) => index === 0 ? num : result - num, 0);
    case 'multiplication':
      return numbers.reduce((product, num) => product * num, 1);
    case 'division':
      return numbers.reduce((result, num, index) => index === 0 ? num : result / num, numbers[0]);
    default:
      return 0;
  }
};

// Generate a fraction question
const generateFractionQuestion = (type: QuizType): [string, number] => {
  let numerator1 = getRandomNumber(1, 10);
  let denominator1 = getRandomNumber(1, 10);
  let numerator2 = getRandomNumber(1, 10);
  let denominator2 = getRandomNumber(1, 10);
  
  let question = '';
  let answer = 0;
  
  switch (type) {
    case 'multiplication':
      question = `(${numerator1}/${denominator1}) × (${numerator2}/${denominator2})`;
      answer = (numerator1 * numerator2) / (denominator1 * denominator2);
      break;
    case 'division':
      question = `(${numerator1}/${denominator1}) ÷ (${numerator2}/${denominator2})`;
      answer = (numerator1 * denominator2) / (numerator2 * denominator1);
      break;
    default:
      return ['', 0];
  }
  
  return [question, parseFloat(answer.toFixed(2))];
};

// Generate a decimal question
const generateDecimalQuestion = (type: QuizType): [string, number] => {
  let num1 = parseFloat((Math.random() * 10).toFixed(1));
  let num2 = parseFloat((Math.random() * 10).toFixed(1));
  
  let question = '';
  let answer = 0;
  
  switch (type) {
    case 'multiplication':
      question = `${num1} × ${num2}`;
      answer = num1 * num2;
      break;
    case 'division':
      if (num2 === 0) num2 = 0.5;
      question = `${num1} ÷ ${num2}`;
      answer = num1 / num2;
      break;
    default:
      return ['', 0];
  }
  
  return [question, parseFloat(answer.toFixed(2))];
};

// Generate questions based on quiz type and settings
export const generateQuestions = (
  type: QuizType,
  settings: QuizSettings
): Question[] => {
  const questions: Question[] = [];
  
  let fractionQuestions = 0;
  let decimalQuestions = 0;
  
  if (settings.includeFraction) {
    fractionQuestions = Math.floor(settings.questionCount / 4); // 25% fraction questions
  }
  
  if (settings.includeDecimal) {
    decimalQuestions = Math.floor(settings.questionCount / 4); // 25% decimal questions
  }
  
  let regularQuestions = settings.questionCount - fractionQuestions - decimalQuestions;
  
  // Generate regular questions
  for (let i = 0; i < regularQuestions; i++) {
    const numbers: number[] = [];
    const terms = settings.terms || 2;
    
    // Create terms based on settings
    for (let j = 0; j < terms; j++) {
      if (type === 'division' && j > 0) {
        // For division, avoid dividing by zero
        numbers.push(getRandomNumber(1, 9));
      } else if (settings.numDigits) {
        numbers.push(generateNumberWithDigits(settings.numDigits));
      } else {
        numbers.push(getRandomNumber(1, 20));
      }
    }
    
    const question = formatQuestion(type, numbers);
    const correctAnswer = calculateAnswer(type, numbers);
    
    questions.push({
      id: i + 1,
      question,
      correctAnswer: parseFloat(correctAnswer.toFixed(2)),
      userAnswer: null,
      startTime: 0,
    });
  }
  
  // Generate fraction questions
  for (let i = 0; i < fractionQuestions; i++) {
    const [question, answer] = generateFractionQuestion(type);
    if (question) {
      questions.push({
        id: regularQuestions + i + 1,
        question,
        correctAnswer: answer,
        userAnswer: null,
        startTime: 0,
      });
    }
  }
  
  // Generate decimal questions
  for (let i = 0; i < decimalQuestions; i++) {
    const [question, answer] = generateDecimalQuestion(type);
    if (question) {
      questions.push({
        id: regularQuestions + fractionQuestions + i + 1,
        question,
        correctAnswer: answer,
        userAnswer: null,
        startTime: 0,
      });
    }
  }
  
  return questions.map(q => ({...q, startTime: Date.now()}));
};
