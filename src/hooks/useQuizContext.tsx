
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
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === id ? { ...q, userAnswer: answer, endTime: Date.now() } : q
      )
    );
  };

  const calculateResults = (): QuizResults => {
    if (!quizType || !settings) {
      throw new Error('Quiz type or settings not defined');
    }

    const completedQuestions = questions.filter(q => q.userAnswer !== undefined);
    const correctAnswers = completedQuestions.filter(q => 
      Number(q.userAnswer) === Number(q.correctAnswer)
    ).length;
    const incorrectAnswers = completedQuestions.length - correctAnswers;
    
    const accuracy = completedQuestions.length > 0 
      ? (correctAnswers / completedQuestions.length) * 100 
      : 0;
    
    // Calculate the time taken for each question and then average it
    const timeTaken = completedQuestions.map(q => 
      ((q.endTime || Date.now()) - q.startTime) / 1000 // Convert to seconds
    );
    
    const averageTime = timeTaken.length > 0 
      ? timeTaken.reduce((sum, time) => sum + time, 0) / timeTaken.length
      : 0;

    const quizResults: QuizResults = {
      type: quizType,
      totalQuestions: questions.length,
      correctAnswers,
      incorrectAnswers,
      accuracy,
      averageTime,
      questions
    };
    
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
