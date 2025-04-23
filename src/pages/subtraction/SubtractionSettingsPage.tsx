
import { Card } from "@/components/ui/card";
import QuizSettingsForm from "@/components/QuizSettingsForm";

const SubtractionSettingsPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-[#f0f4f8] to-[#d0e1f9] p-4">
      <header className="w-full text-center bg-gradient-to-r from-[#4c6ef5] to-[#3b5bdb] text-white py-6 flex items-center justify-center shadow-lg z-10 mb-8">
        <h1 className="text-2xl font-bold tracking-wide m-0">Subtraction Quiz Settings</h1>
      </header>

      <div className="w-full max-w-md">
        <QuizSettingsForm 
          type="subtraction" 
          options={{ 
            showTerms: true 
          }} 
        />
      </div>
    </div>
  );
};

export default SubtractionSettingsPage;
