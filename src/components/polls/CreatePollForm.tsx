import { useState } from "react";
import { useData } from "../../context/DataContext";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";

const CreatePollForm = () => {
  const { addPoll } = useData();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(() => [
    { _id: uuidv4(), text: "" },
    { _id: uuidv4(), text: "" },
    { _id: uuidv4(), text: "" }
  ]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleOptionChange = (id: string, value: string) => {
    setOptions(prevOptions =>
      prevOptions.map(option =>
        option._id === id ? { ...option, text: value } : option
      )
    );
  };

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, { _id: uuidv4(), text: "" }]);
    }
  };

  const handleRemoveOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter(option => option._id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filledOptions = options.filter(option => option.text.trim());
    
    if (question.trim() && filledOptions.length >= 2) {
      addPoll({
        question: question.trim(),
        options: filledOptions.map(option => ({
          id: option._id,
          text: option.text.trim(),
          votes: []
        }))
      });
      
      // Reset form
      setQuestion("");
      setOptions([
        { _id: uuidv4(), text: "" },
        { _id: uuidv4(), text: "" },
        { _id: uuidv4(), text: "" }
      ]);
      setIsExpanded(false);
    }
  };

  const handleCancel = () => {
    setQuestion("");
    setOptions([
      { _id: uuidv4(), text: "" },
      { _id: uuidv4(), text: "" },
      { _id: uuidv4(), text: "" }
    ]);
    setIsExpanded(false);
  };

  // Check if form is valid
  const isValid = question.trim() && options.filter(o => o.text.trim()).length >= 2;

  return (
    <Card className="mb-6 border-indigo-100 plant-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Create a Poll</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isExpanded ? (
            <Input
              placeholder="Ask a question about plantation..."
              className="border-indigo-200 focus-visible:ring-indigo-500"
              onFocus={() => setIsExpanded(true)}
            />
          ) : (
            <>
              <Input
                placeholder="Your poll question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="border-indigo-200 focus-visible:ring-indigo-500"
              />
              
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={option._id} className="flex space-x-2">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option.text}
                      onChange={(e) => handleOptionChange(option._id, e.target.value)}
                      className="border-indigo-200 focus-visible:ring-indigo-500"
                    />
                    {options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveOption(option._id)}
                        className="shrink-0"
                      >
                        <Trash2 className="h-4 w-4 text-gray-500" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              {options.length < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddOption}
                  className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700"
                  disabled={!isValid}
                >
                  Create Poll
                </Button>
              </div>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePollForm;
