
import { QuizType } from "@/types/quiz";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock } from "lucide-react";
import { useQuizContext } from "@/hooks/useQuizContext";
import { useToast } from "@/hooks/use-toast";

const QuizPage = () => {
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();
  const { toast } = useToast();
  const { questions, updateQuestion, resetQuiz } = useQuizContext();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState<string>("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [startTime]);

  useEffect(() => {
    const now = Date.now();
    setStartTime(now);
    setAnswer("");

    const currentQ = questions[currentQuestionIndex];
    if (currentQ && !currentQ.startTime) {
      updateQuestion(currentQ.id, currentQ.userAnswer, now);
    }
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (questions.length === 0) {
      navigate("/");
      toast({
        title: "No quiz in progress",
        description: "Please select a quiz type from the home page.",
      });
    }
  }, [questions, navigate, toast]);

  if (questions.length === 0) {
    return null;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isAnswered = questions.filter(q => q.userAnswer !== undefined && q.userAnswer !== null).length;

  const handleSubmitAnswer = () => {
    if (answer.trim() === "") {
      toast({
        title: "Input required",
        description: "Please enter an answer before continuing.",
        variant: "destructive",
      });
      return;
    }

    const numericAnswer = parseFloat(answer);
    const now = Date.now();
    console.log(`Submitting answer: ${numericAnswer} for question ${currentQuestion.id} at ${now}`);

    // Update the current question with user's answer
    updateQuestion(currentQuestion.id, numericAnswer, now);

    if (currentQuestionIndex < questions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // For the last question - calculate results and navigate
      const updatedQuestions = questions.map(q =>
        q.id === currentQuestion.id
          ? { ...q, userAnswer: numericAnswer, endTime: now }
          : q
      );

      const timeTakenPerQuestion = updatedQuestions.map(q =>
        (q.endTime! - q.startTime) / 1000
      );

      const totalTime = timeTakenPerQuestion.reduce((sum, t) => sum + t, 0);
      const averageTime = timeTakenPerQuestion.length
        ? totalTime / timeTakenPerQuestion.length
        : 0;

      const correctCount = updatedQuestions.filter(q =>
        q.userAnswer !== undefined &&
        Math.abs(Number(q.userAnswer) - Number(q.correctAnswer)) < 0.001
      ).length;

      const results = {
        type: type as QuizType,
        totalQuestions: updatedQuestions.length,
        correctAnswers: correctCount,
        incorrectAnswers: updatedQuestions.length - correctCount,
        accuracy: (correctCount / updatedQuestions.length) * 100,
        averageTime,
        questions: updatedQuestions,
      };

      console.log("Final quiz results:", results);
      console.log("Per-question times (s):", timeTakenPerQuestion);

      navigate("/results", { state: results });
    }
  };

  const handleBackClick = () => {
    resetQuiz();
    if (type) {
      navigate(`/${type}/settings`);
    } else {
      navigate('/');
    }
  };

  const formatQuizTypeText = (type: string = "") => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-[#f0f4f8] to-[#d0e1f9] p-4 overflow-auto">
      <div className="w-full max-w-md">
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleBackClick}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center text-sm font-medium">
                <Clock className="h-4 w-4 mr-1" />
                {formatTime(elapsedTime)}
              </div>
            </div>
            
            <Progress value={progress} className="h-2 mb-6" />
            
            <div className="mb-6">
              <div className="text-sm text-muted-foreground mb-1">Completed: {isAnswered} / {questions.length}</div>
              <div className="text-2xl font-bold text-center p-6 bg-gray-50 rounded-md mb-4 border">
                {currentQuestion.question} = ?
              </div>
              
              <div className="mb-6">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Enter your answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="text-lg text-center"
                />
              </div>
            </div>
            
            <Button
              onClick={handleSubmitAnswer}
              className="w-full bg-gradient-to-r from-[#4c6ef5] to-[#3b5bdb]"
            >
              {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Submit Quiz"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizPage;
