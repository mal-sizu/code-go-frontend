import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { LearningMaterial } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2, FileText, Link, Pencil, X, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface MaterialCardProps {
  material: any;
  onDelete?: () => void;
  onEdit?: (data: Partial<LearningMaterial>) => void;
}

const MaterialCard = ({ material }: MaterialCardProps) => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { deleteLearningMaterial, updateLearningMaterial } = useData();
  const isOwnMaterial = currentUser?.id === material.userId;
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: material.title,
    description: material.description
  });

  const handleDelete = async () => {
    if (!isOwnMaterial) return;
    try {
      await deleteLearningMaterial(material.id);
      toast({
        title: "Material deleted",
        description: "Learning material has been successfully deleted.",
        variant: "default"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to delete material",
        description: "Could not delete material. Please try again.",
      });
    }
  };

  const handleEdit = () => {
    if (!isOwnMaterial) return;
    setIsEditing(true);
    setEditFormData({
      title: material.title,
      description: material.description
    });
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({
      title: material.title,
      description: material.description
    });
  };
  
  const handleFormChange = (field: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editFormData.title.trim()) {
      toast({
        title: "Validation error",
        description: "Title cannot be empty",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for API
      const updatedMaterialData = {
        title: editFormData.title,
        description: editFormData.description
      };

      // Call API to update material
      await updateLearningMaterial(material.id, updatedMaterialData);

      // Close edit form
      setIsEditing(false);

      // Show success message
      toast({
        title: "Material updated",
        description: "Your learning material has been updated successfully",
        variant: "default"
      });
    } catch (error) {
      console.error("Failed to update material:", error);
      
      let errorMessage = "There was an error updating your learning material.";
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = error.message || errorMessage;
      }
      
      toast({
        title: "Update failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-6 overflow-hidden plant-card border-green-100">
      <div className="flex items-center justify-between p-4 border-b border-green-100">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={material.userProfileImage} alt={material.username || ''} />
            <AvatarFallback>
              {(material.username?.substring(0, 2) || 'US').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{material.username || 'Unknown User'}</p>
            <p className="text-xs text-gray-500">
              {material.createdAt ? 
                formatDistanceToNow(new Date(material.createdAt), { addSuffix: true }) : 
                'Recently'}
            </p>
          </div>
        </div>
        
        {isOwnMaterial && !isEditing && (
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-blue-500"
              onClick={handleEdit}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-red-500"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {isEditing && (
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-red-500"
              onClick={handleCancelEdit}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <CardContent className="pt-4">
        {!isEditing ? (
          <>
            <div className="flex items-center gap-2 mb-4">
              {material.fileType === 'pdf' ? (
                <FileText className="h-6 w-6 text-green-600" />
              ) : (
                <Link className="h-6 w-6 text-green-600" />
              )}
              <h3 className="text-lg font-semibold">{material.title}</h3>
            </div>
            
            <p className="text-gray-700 mb-4">{material.description}</p>
            
            <Button
              variant="outline"
              className="w-full justify-start text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
              onClick={() => window.open(material.fileUrl, '_blank')}
            >
              {material.fileType === 'pdf' ? 'Open PDF' : 'Open Link'}
            </Button>
          </>
        ) : (
          <form onSubmit={handleSubmitEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="material-title">Title</Label>
              <Input 
                id="material-title"
                value={editFormData.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                placeholder="Enter material title"
                disabled={isSubmitting}
                className="w-full border-green-200 focus:border-green-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="material-description">Description</Label>
              <Textarea
                id="material-description"
                value={editFormData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                placeholder="Enter material description"
                disabled={isSubmitting}
                className="w-full border-green-200 focus:border-green-400"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <Button 
                variant="outline"
                type="button" 
                onClick={handleCancelEdit}
                className="mr-2"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
                {!isSubmitting && <Save className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default MaterialCard;
