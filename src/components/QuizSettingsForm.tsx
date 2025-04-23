
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import { QuizSettings, QuizType } from "@/types/quiz";
import { useQuizContext } from "@/hooks/useQuizContext";
import { generateQuestions } from "@/utils/quizGenerator";

interface QuizSettingsFormProps {
  type: QuizType;
  options?: {
    showDigits?: boolean;
    showTerms?: boolean;
    showFraction?: boolean;
    showDecimal?: boolean;
  };
}

export const QuizSettingsForm = ({ type, options = {} }: QuizSettingsFormProps) => {
  const navigate = useNavigate();
  const { setQuizType, setSettings, setQuestions } = useQuizContext();
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [numDigits, setNumDigits] = useState<number>(1);
  const [terms, setTerms] = useState<number>(2);
  const [includeFraction, setIncludeFraction] = useState<boolean>(false);
  const [includeDecimal, setIncludeDecimal] = useState<boolean>(false);

  const handleStartQuiz = () => {
    const settings: QuizSettings = {
      questionCount,
      ...(options.showDigits && { numDigits }),
      ...(options.showTerms && { terms }),
      ...(options.showFraction && { includeFraction }),
      ...(options.showDecimal && { includeDecimal }),
    };

    setQuizType(type);
    setSettings(settings);
    
    const quizQuestions = generateQuestions(type, settings);
    setQuestions(quizQuestions);
    
    navigate(`/quiz/${type}`);
  };

  const formatQuizTypeText = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
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
          <h2 className="text-2xl font-bold text-center">{formatQuizTypeText(type)} Quiz Settings</h2>
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

          {options.showDigits && (
            <div>
              <Label htmlFor="numDigits" className="block mb-2">
                Number of Digits: {numDigits}
              </Label>
              <Slider
                id="numDigits"
                min={1}
                max={3}
                step={1}
                value={[numDigits]}
                onValueChange={(value) => setNumDigits(value[0])}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1</span>
                <span>3</span>
              </div>
            </div>
          )}

          {options.showTerms && (
            <div>
              <Label htmlFor="terms" className="block mb-2">
                Number of Terms: {terms}
              </Label>
              <Slider
                id="terms"
                min={2}
                max={5}
                step={1}
                value={[terms]}
                onValueChange={(value) => setTerms(value[0])}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>2</span>
                <span>5</span>
              </div>
            </div>
          )}

          {options.showFraction && (
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeFraction"
                checked={includeFraction}
                onCheckedChange={(checked) => setIncludeFraction(!!checked)} 
              />
              <Label htmlFor="includeFraction">Include Fraction Questions</Label>
            </div>
          )}

          {options.showDecimal && (
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeDecimal"
                checked={includeDecimal}
                onCheckedChange={(checked) => setIncludeDecimal(!!checked)} 
              />
              <Label htmlFor="includeDecimal">Include Decimal Questions</Label>
            </div>
          )}

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

export default QuizSettingsForm;
