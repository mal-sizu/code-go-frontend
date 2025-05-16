import { useState } from "react";
import { useData } from "../../context/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "../../hooks/use-toast";

const CreateMaterialForm = () => {
  const { addLearningMaterial } = useData();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState<"pdf" | "link">("link");
  const [isExpanded, setIsExpanded] = useState(false);

  const validateUrl = (url: string, type: "pdf" | "link"): boolean => {
    try {
      new URL(url);
      
      if (type === "pdf") {
        // Basic check for PDF URL, could be more sophisticated
        return url.toLowerCase().endsWith('.pdf') || url.toLowerCase().includes('/pdf');
      }
      
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !fileUrl.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields.",
      });
      return;
    }
    
    if (!validateUrl(fileUrl, fileType)) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: fileType === "pdf" ? "Please enter a valid PDF URL." : "Please enter a valid URL.",
      });
      return;
    }
    
    addLearningMaterial({
      title: title.trim(),
      description: description.trim(),
      fileUrl: fileUrl.trim(),
      fileType
    });
    
    // Reset form
    setTitle("");
    setDescription("");
    setFileUrl("");
    setFileType("link");
    setIsExpanded(false);
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setFileUrl("");
    setFileType("link");
    setIsExpanded(false);
  };

  return (
    <Card className="mb-6 border-indigo-100 plant-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Share Learning Materials</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isExpanded ? (
            <Input
              placeholder="Share a useful resource about plantation..."
              className="border-indigo-200 focus-visible:ring-indigo-500"
              onFocus={() => setIsExpanded(true)}
            />
          ) : (
            <>
              <Input
                placeholder="Title of the learning material"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-indigo-200 focus-visible:ring-indigo-500"
              />
              
              <Textarea
                placeholder="Brief description of the resource"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none border-indigo-200 focus-visible:ring-indigo-500"
                rows={2}
              />
              
              <RadioGroup
                value={fileType}
                onValueChange={(value) => setFileType(value as "pdf" | "link")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pdf" id="pdf" />
                  <Label htmlFor="pdf">PDF</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="link" id="link" />
                  <Label htmlFor="link">Website Link</Label>
                </div>
              </RadioGroup>
              
              <Input
                placeholder={fileType === "pdf" ? "URL to PDF document" : "URL to website resource"}
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                className="border-indigo-200 focus-visible:ring-indigo-500"
              />
              
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
                  disabled={!title.trim() || !description.trim() || !fileUrl.trim()}
                >
                  Share Resource
                </Button>
              </div>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateMaterialForm;
