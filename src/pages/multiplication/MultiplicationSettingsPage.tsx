
import { Card } from "@/components/ui/card";
import QuizSettingsForm from "@/components/QuizSettingsForm";

const MultiplicationSettingsPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-[#f0f4f8] to-[#d0e1f9] p-4 overflow-auto">
      <header className="w-full text-center bg-transparent text-black py-6 flex items-center justify-center z-10 mb-8">
        <h1 className="text-3xl font-bold tracking-wide m-0">Settings</h1>
      </header>

      <div className="w-full max-w-md">
        <QuizSettingsForm 
          type="multiplication" 
          options={{ 
            showDigits: true,
            showTerms: true,
            showFraction: true,
            showDecimal: true
          }} 
        />
      </div>
    </div>
  );
};

export default MultiplicationSettingsPage;
