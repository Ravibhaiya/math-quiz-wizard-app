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
  updateQuestion: (id: number, answer: number | null, time?: number) => void;
  calculateResults: () => QuizResults;
  resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextProps | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [quizType, setQuizType] = useState<QuizType | null>(null);
  const [settings, setSettings] = useState<QuizSettings | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<QuizResults | null>(null);

  const updateQuestion = (id: number, answer: number | null, time?: number) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => {
        if (q.id === id) {
          return {
            ...q,
            userAnswer: answer,
            startTime: q.startTime ?? time,
            endTime: time ?? Date.now(),
          };
        }
        return q;
      })
    );
  };

  const areAnswersEqual = (userAnswer: number | undefined | null, correctAnswer: number) => {
    if (userAnswer === undefined || userAnswer === null) return false;
    
    if (Math.abs(Number(userAnswer) - Number(correctAnswer)) < 0.001) {
      return true;
    }
    
    return Number(userAnswer) === Number(correctAnswer);
  };

  const calculateResults = (): QuizResults => {
    if (!quizType || !settings) {
      throw new Error('Quiz type or settings not defined');
    }

    const currentQuestions = [...questions];
    const completedQuestions = currentQuestions.filter(q => q.userAnswer !== undefined && q.userAnswer !== null);
    const correctAnswers = completedQuestions.filter(q => areAnswersEqual(q.userAnswer, q.correctAnswer)).length;
    const incorrectAnswers = completedQuestions.length - correctAnswers;
    const accuracy = completedQuestions.length > 0 ? (correctAnswers / completedQuestions.length) * 100 : 0;
    
    let totalTimeInSeconds = 0;
    let questionCount = 0;
    
    completedQuestions.forEach(q => {
      if (q.endTime && q.startTime) {
        totalTimeInSeconds += (q.endTime - q.startTime) / 1000;
        questionCount++;
      }
    });
    
    const averageTime = questionCount > 0 ? Math.round(totalTimeInSeconds / questionCount) : 0;
    
    const quizResults: QuizResults = {
      type: quizType,
      totalQuestions: questions.length,
      correctAnswers,
      incorrectAnswers,
      accuracy,
      averageTime,
      questions: currentQuestions
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
