import { useState, useRef } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase"; // Update path
import { useData } from "../../context/DataContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CreatePostForm = () => {
  const { addPost } = useData();
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) return;

    let imageUrl = "";
    
    try {
      // Upload image if exists
      if (imageFile) {
        const storageRef = ref(storage, `posts/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      // Add post with image URL
      addPost({
        title: title.trim(),
        image: imageUrl,
        description: description.trim(),
      });

      // Reset form
      setTitle("");
      setImageFile(null);
      setDescription("");
      setIsExpanded(false);
      if (fileInputRef.current) fileInputRef.current.value = "";

    } catch (error) {
      console.error("Upload failed:", error);
      // Add your error handling/toast here
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <Card className="mb-6 border-indigo-100 plant-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Share Your Plantation Journey</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isExpanded ? (
            <Textarea
              placeholder="What's on your mind about plants today?"
              className="resize-none border-indigo-200 focus-visible:ring-indigo-500"
              onFocus={() => setIsExpanded(true)}
            />
          ) : (
            <>
              <Input
                placeholder="Post Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-indigo-200 focus-visible:ring-indigo-500"
                required
              />
              
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="border-indigo-200 focus-visible:ring-indigo-500"
              />
              
              <Textarea
                placeholder="Share your thoughts, tips, or questions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none border-indigo-200 focus-visible:ring-indigo-500"
                rows={3}
                required
              />
              
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setTitle("");
                    setImageFile(null);
                    setDescription("");
                    setIsExpanded(false);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Post
                </Button>
              </div>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePostForm;
