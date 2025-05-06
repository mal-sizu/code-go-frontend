import { useState, useEffect } from "react";
import { useData } from "../../context/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import QuizResult from "./QuizResult";
import { Progress } from "@/components/ui/progress";

const QuizComponent = () => {
  const { 
    currentQuiz, 
    currentQuestionIndex, 
    quizScore, 
    startQuiz, 
    submitAnswer, 
    resetQuiz 
  } = useData();
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();

  // For debugging purposes
  useEffect(() => {
    console.log("Current Quiz:", currentQuiz);
    console.log("Current Question Index:", currentQuestionIndex);
  }, [currentQuiz, currentQuestionIndex]);

  // Handler for starting the quiz
  const handleStartQuiz = async () => {
    setIsLoading(true);
    try {
      await startQuiz(); // This will fetch random questions from API
      setIsStarted(true);
      setIsCompleted(false);
    } catch (error) {
      console.error("Failed to start quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for moving to next question
  const handleNextQuestion = () => {
    submitAnswer(selectedAnswer);
    setSelectedAnswer("");
    
    // Check if this was the last question
    if (currentQuestionIndex === currentQuiz.length - 1) {
      setIsCompleted(true);
    }
  };

  // Handler for resetting the quiz
  const handleResetQuiz = () => {
    resetQuiz();
    setIsStarted(false);
    setIsCompleted(false);
  };

  // Render the start screen
  if (!isStarted) {
    return (
      <div className="text-center p-8">
        <Card className="max-w-md mx-auto plant-shadow border-green-100">
          <CardHeader>
            <CardTitle>Plant Knowledge Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Test your knowledge with 10 random questions about plants!</p>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={handleStartQuiz}
              disabled={isLoading}
            >
              {isLoading ? "Loading Questions..." : "Start Quiz"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Display quiz completion screen with certificate
  if (isCompleted) {
    const scorePercentage = (quizScore / currentQuiz.length) * 100;
    return (
      <QuizResult 
        score={scorePercentage} 
        resetQuiz={handleResetQuiz} 
      />
    );
  }

  // If quiz has started but there are no questions yet
  if (currentQuiz.length === 0) {
    return (
      <div className="text-center p-8">
        <Card className="max-w-md mx-auto plant-shadow border-green-100">
          <CardContent className="py-8">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent mb-4"></div>
              <p>Loading questions...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Display current question
  const currentQuestion = currentQuiz[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex) / currentQuiz.length) * 100;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">
          Question {currentQuestionIndex + 1} of {currentQuiz.length}
        </h3>
        <span className="text-green-600 font-medium">Score: {quizScore}</span>
      </div>
      
      <Progress value={progressPercentage} className="h-2 mb-4 bg-green-100" />
            
      <Card className="mb-6 plant-shadow border-green-100">
        <CardHeader>
          <CardTitle className="text-lg">{currentQuestion.questionText}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <Button
              key={index}
              variant={selectedAnswer === option ? "default" : "outline"}
              className={`w-full justify-start font-normal ${
                selectedAnswer === option ? "bg-green-600 hover:bg-green-700" : "hover:border-green-600 hover:text-green-600"
              }`}
              onClick={() => setSelectedAnswer(option)}
            >
              {option}
            </Button>
          ))}
          <Button
            className="w-full bg-green-600 hover:bg-green-700 mt-6"
            onClick={handleNextQuestion}
            disabled={!selectedAnswer}
          >
            {currentQuestionIndex === currentQuiz.length - 1 ? "Finish Quiz" : "Next Question"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizComponent;