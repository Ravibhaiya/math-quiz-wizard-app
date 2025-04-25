
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
  const { questions, updateQuestion, calculateResults } = useQuizContext();
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
    setStartTime(Date.now());
    setAnswer("");
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

    // Convert string to number and ensure it's saved correctly
    const numericAnswer = parseFloat(answer);
    console.log(`Submitting answer: ${numericAnswer} for question ${currentQuestion.id}`);
    
    // For all questions including the last one
    if (currentQuestionIndex < questions.length - 1) {
      // Update the current question first
      updateQuestion(currentQuestion.id, numericAnswer);
      // Then move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // For the last question - create a copy of questions with the last answer
      const updatedQuestions = [...questions];
      const lastQuestion = {...updatedQuestions[currentQuestionIndex]};
      lastQuestion.userAnswer = numericAnswer;
      lastQuestion.endTime = Date.now();
      updatedQuestions[currentQuestionIndex] = lastQuestion;
      
      // Calculate the time taken for each question and the average time
      let totalTimeInSeconds = 0;
      let questionCount = 0;
      
      updatedQuestions.forEach(q => {
        if (q.endTime && q.startTime) {
          const questionTimeInSeconds = (q.endTime - q.startTime) / 1000;
          console.log(`Question ${q.id} time: ${questionTimeInSeconds.toFixed(2)} seconds`);
          totalTimeInSeconds += questionTimeInSeconds;
          questionCount++;
        }
      });
      
      // Calculate average time per question (in seconds)
      const averageTimePerQuestion = questionCount > 0 ? totalTimeInSeconds / questionCount : 0;
      console.log(`Total time: ${totalTimeInSeconds.toFixed(2)} seconds, Questions: ${questionCount}, Average time per question: ${averageTimePerQuestion.toFixed(2)} seconds`);
      
      // Use this updated array to calculate results directly
      const manualResults = {
        type: type as QuizType,
        totalQuestions: updatedQuestions.length,
        correctAnswers: updatedQuestions.filter(q => 
          q.userAnswer !== undefined && Math.abs(q.userAnswer - q.correctAnswer) < 0.001
        ).length,
        incorrectAnswers: 0, // Will be calculated below
        accuracy: 0, // Will be calculated below
        averageTime: averageTimePerQuestion, // This is now properly set as the average time per question
        questions: updatedQuestions
      };
      
      manualResults.incorrectAnswers = manualResults.totalQuestions - manualResults.correctAnswers;
      manualResults.accuracy = (manualResults.correctAnswers / manualResults.totalQuestions) * 100;
      
      console.log("Manual final quiz results:", manualResults);
      
      // Also update the state for consistency
      updateQuestion(currentQuestion.id, numericAnswer);
      
      // Navigate with our manually calculated results
      navigate("/results", { state: manualResults });
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
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm font-medium">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
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
