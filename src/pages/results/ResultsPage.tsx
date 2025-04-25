
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuizContext } from "@/hooks/useQuizContext";
import { QuizResults, QuizType } from "@/types/quiz";
import { ArrowLeft, Check, X, Home, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const ResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { quizType, resetQuiz, results: contextResults } = useQuizContext();
  const results = location.state as QuizResults || contextResults;

  // Redirect if no results
  useEffect(() => {
    if (!results) {
      navigate("/");
    }
  }, [results, navigate]);

  useEffect(() => {
    // Log all questions and answers when component mounts
    if (results && results.questions) {
      console.log("Results page questions:", results.questions.map(q => ({
        id: q.id,
        question: q.question,
        correctAnswer: q.correctAnswer,
        userAnswer: q.userAnswer
      })));
    }
  }, [results]);

  if (!results) {
    return null; // Don't render anything before redirect
  }

  const handleRetakeQuiz = () => {
    const quizType = results.type;
    navigate(`/${quizType}/settings`);
  };

  const handleGoHome = () => {
    resetQuiz();
    navigate("/");
  };

  const formatQuizTypeText = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Helper function to strictly compare answers, accounting for floating point precision issues
  const areAnswersEqual = (userAnswer: number | undefined | null, correctAnswer: number) => {
    if (userAnswer === undefined || userAnswer === null) return false;
    
    // Handle floating point comparison with small epsilon
    if (Math.abs(Number(userAnswer) - Number(correctAnswer)) < 0.001) {
      return true;
    }
    
    return Number(userAnswer) === Number(correctAnswer);
  };
  
  // Format seconds to mm:ss format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-[#f0f4f8] to-[#d0e1f9] p-4 overflow-auto">
      <header className="w-full text-center bg-transparent text-black py-6 flex items-center justify-center z-10 mb-8">
        <h1 className="text-3xl font-bold tracking-wide m-0">Results</h1>
      </header>

      <div className="w-full max-w-md">
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Your Performance</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-md text-center border">
                <div className="text-sm text-muted-foreground mb-2">Correct Answers</div>
                <div className="flex items-center justify-center text-green-600">
                  <Check className="h-5 w-5 mr-1" />
                  <span className="text-xl font-bold">{results.correctAnswers}</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md text-center border">
                <div className="text-sm text-muted-foreground mb-2">Incorrect Answers</div>
                <div className="flex items-center justify-center text-red-500">
                  <X className="h-5 w-5 mr-1" />
                  <span className="text-xl font-bold">{results.incorrectAnswers}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Accuracy</span>
                  <span className="text-sm font-medium">{results.accuracy.toFixed(1)}%</span>
                </div>
                <Progress value={results.accuracy} className="h-2" />
              </div>

              <div className="bg-gray-50 p-4 rounded-md text-center border">
                <div className="text-sm text-muted-foreground mb-2">Average Time per Question</div>
                <div className="text-xl font-bold">{formatTime(results.averageTime)} ({results.averageTime.toFixed(1)} seconds)</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={handleRetakeQuiz}
                className="flex items-center justify-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retake Quiz
              </Button>

              <Button
                onClick={handleGoHome}
                className="bg-gradient-to-r from-[#4c6ef5] to-[#3b5bdb] flex items-center justify-center"
              >
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Question Details</h3>
            
            <div className="space-y-4">
              {results.questions.map((question, index) => {
                // Log each question for debugging
                console.log(`Question ${index + 1}:`, {
                  question: question.question,
                  correctAnswer: question.correctAnswer,
                  userAnswer: question.userAnswer,
                  isCorrect: areAnswersEqual(question.userAnswer, question.correctAnswer)
                });
                
                const isAnswered = question.userAnswer !== undefined && question.userAnswer !== null;
                const isCorrect = isAnswered && areAnswersEqual(question.userAnswer, question.correctAnswer);
                
                return (
                  <div 
                    key={question.id}
                    className={`p-3 rounded-md border ${
                      isAnswered
                        ? (isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200')
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">Q{index + 1}: {question.question} = ?</div>
                        <div className="text-sm mt-1">
                          Correct answer: <span className="font-semibold">{question.correctAnswer}</span>
                        </div>
                        <div className="text-sm mt-1">
                          Your answer: <span className="font-semibold">
                            {isAnswered ? question.userAnswer : "No answer"}
                          </span>
                        </div>
                      </div>
                      <div className={`rounded-full p-1 ${
                        isAnswered
                          ? (isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500')
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {isAnswered
                          ? (isCorrect ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />)
                          : <X className="h-5 w-5" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResultsPage;
