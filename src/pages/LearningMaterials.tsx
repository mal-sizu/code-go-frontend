
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import CreateMaterialForm from "../components/learning/CreateMaterialForm";
import MaterialCard from "../components/learning/MaterialCard";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const LearningMaterials = () => {
  const { isAuthenticated } = useAuth();
  const { learningMaterials } = useData();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 bg-indigo-50/50">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-6">
            <FileText className="h-16 w-16 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-indigo-800 mb-4">Plantation Learning Resources</h1>
          <p className="text-xl text-gray-700 max-w-2xl">
            Access a wealth of knowledge, guides, and documents about plantation techniques and best practices.
          </p>
        </div>

        <Button 
          className="text-lg py-6 px-8 bg-indigo-600 hover:bg-indigo-700" 
          onClick={() => navigate("/login")}
        >
          Login to Access Materials
        </Button>
      </div>
    );
  }

  return (
    <div>
      <CreateMaterialForm />
      
      <div>
        {learningMaterials.length > 0 ? (
          learningMaterials.map(material => (
            <MaterialCard key={material.id} material={material} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No learning materials yet. Be the first one to share a resource!
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningMaterials;
