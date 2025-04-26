
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CirclePlus, 
  Minus, 
  X, 
  Divide,
  Percent
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  
  const quizTypes = [
    {
      title: "Addition",
      description: "Practice adding numbers together",
      icon: <CirclePlus className="w-10 h-10 text-green-500" />,
      path: "/addition/settings"
    },
    {
      title: "Subtraction",
      description: "Practice subtracting numbers",
      icon: <Minus className="w-10 h-10 text-red-500" />,
      path: "/subtraction/settings"
    },
    {
      title: "Multiplication",
      description: "Practice multiplying numbers",
      icon: <X className="w-10 h-10 text-blue-500" />,
      path: "/multiplication/settings"
    },
    {
      title: "Division",
      description: "Practice dividing numbers",
      icon: <Divide className="w-10 h-10 text-purple-500" />,
      path: "/division/settings"
    },
    {
      title: "Percentage",
      description: "Convert between percentages and fractions",
      icon: <Percent className="w-10 h-10 text-orange-500" />,
      path: "/percentage/settings"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-[#f0f4f8] to-[#d0e1f9] p-4 overflow-auto">
      <header className="w-full text-center bg-transparent text-black py-6 flex flex-col items-center justify-center z-10">
        <h1 className="text-5xl font-bold tracking-wide m-0">Math Quiz</h1>
        <p className="mt-2 text-lg text-gray-600">Challenge yourself with different math quizzes</p>
      </header>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {quizTypes.map((quiz, index) => (
          <Card key={index} className="transition-all hover:shadow-lg hover:-translate-y-1 hover:bg-blue-50">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-blue-50 p-3">
                  {quiz.icon}
                </div>
                <h2 className="text-2xl font-semibold mb-2">{quiz.title}</h2>
                <p className="text-gray-500 mb-4">{quiz.description}</p>
                <Button 
                  onClick={() => navigate(quiz.path)}
                  className="bg-gradient-to-r from-[#4c6ef5] to-[#3b5bdb] hover:from-[#3b5bdb] hover:to-[#2a3b90]"
                >
                  Start Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Index;
