import { useAuth } from "../context/AuthContext";
import QuizComponent from "../components/quiz/QuizComponent";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

const Quiz = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 bg-indigo-50/50">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-6">
            <HelpCircle className="h-16 w-16 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-indigo-800 mb-4">Test Your Programming Knowledge</h1>
            <p className="text-xl text-gray-700 max-w-2xl">
            Challenge yourself with our interactive quiz on programming fundamentals and enhance your coding skills.
            </p>
        </div>

        <Button 
          className="text-lg py-6 px-8 bg-indigo-600 hover:bg-indigo-700" 
          onClick={() => navigate("/login")}
        >
          Login to Take the Quiz
        </Button>
      </div>
    );
  }

  return (
    <div>
      <QuizComponent />
    </div>
  );
};

export default Quiz;
