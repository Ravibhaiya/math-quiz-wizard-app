
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { QuizSettings, QuizType, QuizResults, Question } from '@/types/quiz';

interface QuizContextProps {
  quizType: QuizType | null;
  settings: QuizSettings | null;
  questions: Question[];
  results: QuizResults | null;
  setQuizType: (type: QuizType) => void;
  setSettings: (settings: QuizSettings) => void;
  setQuestions: (questions: Question[]) => void;
  updateQuestion: (id: number, answer: number) => void;
  calculateResults: () => QuizResults;
  resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextProps | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [quizType, setQuizType] = useState<QuizType | null>(null);
  const [settings, setSettings] = useState<QuizSettings | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<QuizResults | null>(null);

  const updateQuestion = (id: number, answer: number) => {
    console.log(`Updating question ${id} with answer: ${answer}`);
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === id ? { ...q, userAnswer: answer, endTime: Date.now() } : q
      )
    );
  };

  // Helper function to strictly compare answers with proper number comparison
  const areAnswersEqual = (userAnswer: number | undefined | null, correctAnswer: number) => {
    if (userAnswer === undefined || userAnswer === null) return false;
    
    // Handle floating point comparison with small epsilon
    if (Math.abs(Number(userAnswer) - Number(correctAnswer)) < 0.001) {
      return true;
    }
    
    return Number(userAnswer) === Number(correctAnswer);
  };

  const calculateResults = (): QuizResults => {
    if (!quizType || !settings) {
      throw new Error('Quiz type or settings not defined');
    }

    // Create a copy of the questions to ensure we're not losing state
    const currentQuestions = [...questions];
    
    // Log all questions with their answers for debugging
    console.log("Questions with answers for results calculation:", 
      currentQuestions.map(q => ({
        id: q.id,
        question: q.question,
        correctAnswer: q.correctAnswer,
        userAnswer: q.userAnswer,
        startTime: q.startTime,
        endTime: q.endTime
      }))
    );

    const completedQuestions = currentQuestions.filter(q => q.userAnswer !== undefined && q.userAnswer !== null);
    console.log(`Completed questions count: ${completedQuestions.length}`);
    
    const correctAnswers = completedQuestions.filter(q => 
      areAnswersEqual(q.userAnswer, q.correctAnswer)
    ).length;
    console.log(`Correct answers count: ${correctAnswers}`);
    
    const incorrectAnswers = completedQuestions.length - correctAnswers;
    
    const accuracy = completedQuestions.length > 0 
      ? (correctAnswers / completedQuestions.length) * 100 
      : 0;
    
    // Calculate the time taken for each question (in seconds)
    let totalTimeInSeconds = 0;
    let questionCount = 0;
    
    completedQuestions.forEach(q => {
      if (q.endTime && q.startTime) {
        const questionTimeInSeconds = (q.endTime - q.startTime) / 1000;
        console.log(`Question ${q.id} time: ${questionTimeInSeconds.toFixed(2)} seconds`);
        totalTimeInSeconds += questionTimeInSeconds;
        questionCount++;
      }
    });
    
    // Calculate average time per question (in seconds)
    const averageTime = questionCount > 0 ? totalTimeInSeconds / questionCount : 0;
    console.log(`Total time: ${totalTimeInSeconds.toFixed(2)} seconds, Questions: ${questionCount}, Average time per question: ${averageTime.toFixed(2)} seconds`);
    
    const quizResults: QuizResults = {
      type: quizType,
      totalQuestions: questions.length,
      correctAnswers,
      incorrectAnswers,
      accuracy,
      averageTime, // This is now properly the average time per question
      questions: currentQuestions
    };
    
    console.log("Final quiz results:", quizResults);
    setResults(quizResults);
    return quizResults;
  };

  const resetQuiz = () => {
    setQuizType(null);
    setSettings(null);
    setQuestions([]);
    setResults(null);
  };

  return (
    <QuizContext.Provider
      value={{
        quizType,
        settings,
        questions,
        results,
        setQuizType,
        setSettings,
        setQuestions,
        updateQuestion,
        calculateResults,
        resetQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuizContext must be used within a QuizProvider');
  }
  return context;
};
