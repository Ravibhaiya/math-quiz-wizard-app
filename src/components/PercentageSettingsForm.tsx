
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import { QuizSettings } from "@/types/quiz";
import { useQuizContext } from "@/hooks/useQuizContext";
import { generatePercentageQuestions } from "@/utils/percentageQuizGenerator";

const PercentageSettingsForm = () => {
  const navigate = useNavigate();
  const { setQuizType, setSettings, setQuestions } = useQuizContext();
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [maxDenominator, setMaxDenominator] = useState<number>(10);
  const [reverseMode, setReverseMode] = useState<boolean>(false);

  const handleStartQuiz = () => {
    const settings: QuizSettings = {
      questionCount,
      maxDenominator,
      reverseMode
    };

    setQuizType('percentage');
    setSettings(settings);
    
    const quizQuestions = generatePercentageQuestions(settings);
    setQuestions(quizQuestions);
    
    navigate(`/quiz/percentage`);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="pl-1 mb-2 text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Home
          </Button>
          <h2 className="text-2xl font-bold text-center">Percentage Quiz Settings</h2>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="questionCount" className="block mb-2">
              Number of Questions: {questionCount}
            </Label>
            <Slider
              id="questionCount"
              min={5}
              max={30}
              step={5}
              value={[questionCount]}
              onValueChange={(value) => setQuestionCount(value[0])}
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5</span>
              <span>30</span>
            </div>
          </div>

          <div>
            <Label htmlFor="maxDenominator" className="block mb-2">
              Maximum Denominator: {maxDenominator}
            </Label>
            <Slider
              id="maxDenominator"
              min={5}
              max={20}
              step={1}
              value={[maxDenominator]}
              onValueChange={(value) => setMaxDenominator(value[0])}
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5</span>
              <span>20</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="reverseMode"
              checked={reverseMode}
              onCheckedChange={(checked) => setReverseMode(!!checked)} 
            />
            <Label htmlFor="reverseMode">
              Reverse Mode (Fraction to Percentage)
            </Label>
          </div>

          <Button
            onClick={handleStartQuiz}
            className="w-full bg-gradient-to-r from-[#4c6ef5] to-[#3b5bdb]"
          >
            Start Quiz
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PercentageSettingsForm;
