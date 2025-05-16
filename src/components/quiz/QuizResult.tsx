import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Download, FileText, Home, RefreshCw } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";

interface QuizResultProps {
  score: number;
  resetQuiz: () => void;
}

const QuizResult = ({ score, resetQuiz }: QuizResultProps) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();

  const downloadAsPNG = async () => {
    if (certificateRef.current) {
      setIsDownloading(true);
      try {
        const canvas = await html2canvas(certificateRef.current, {
          scale: 2, // Higher resolution
          backgroundColor: "#ffffff",
        });
        const imageData = canvas.toDataURL("image/png");
        
        const link = document.createElement("a");
        link.href = imageData;
        link.download = "Code Go-Certificate.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error generating PNG certificate:", error);
      } finally {
        setIsDownloading(false);
      }
    }
  };

  const downloadAsPDF = async () => {
    if (certificateRef.current) {
      setIsDownloading(true);
      try {
        const canvas = await html2canvas(certificateRef.current, {
          scale: 2, // Higher resolution
          backgroundColor: "#ffffff",
        });
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        
        // Calculate PDF dimensions to match the certificate aspect ratio
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        const pdf = new jsPDF("p", "mm", "a4");
        pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
        pdf.save("Code Go-Certificate.pdf");
      } catch (error) {
        console.error("Error generating PDF certificate:", error);
      } finally {
        setIsDownloading(false);
      }
    }
  };

  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const getFeedbackText = () => {
    if (score >= 90) return "Outstanding! You're a plantation expert!";
    if (score >= 80) return "Excellent work! You have extensive plantation knowledge.";
    if (score >= 70) return "Great job! You have good plantation knowledge.";
    if (score >= 60) return "Good work! You understand most plantation concepts.";
    if (score >= 50) return "Not bad! You're learning about plantation.";
    if (score >= 40) return "You're making progress with plantation knowledge.";
    return "Keep learning about plantation basics.";
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      <Card className="plant-shadow border-indigo-100">
        <CardHeader>
          <CardTitle className="text-center text-xl flex justify-center items-center">
            <CheckCircle2 className="mr-2 h-6 w-6 text-indigo-500" />
            Quiz Completed!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-4xl font-bold text-indigo-600">{Math.round(score)}%</div>
          <p className="text-gray-600">
            {getFeedbackText()}
          </p>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 justify-center">
          <Button 
            variant="outline" 
            className="border-indigo-600 text-indigo-600"
            onClick={resetQuiz}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={downloadAsPDF}
            disabled={isDownloading}
          >
            <FileText className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button 
            variant="outline"
            className="border-indigo-600 text-indigo-600"
            onClick={downloadAsPNG}
            disabled={isDownloading}
          >
            <Download className="mr-2 h-4 w-4" />
            Download PNG
          </Button>
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={() => navigate('/')}
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
        </CardFooter>
      </Card>

      <div className="relative">
        <div 
          ref={certificateRef}
          className="bg-white border-8 border-double border-indigo-200 p-8 text-center space-y-4"
          style={{ width: "100%", height: "auto", minHeight: "500px" }}
        >
          <div className="relative">
            {/* Decorative plant corner elements */}
            <div className="absolute top-0 left-0 text-indigo-300 opacity-20 text-6xl">🌿</div>
            <div className="absolute top-0 right-0 text-indigo-300 opacity-20 text-6xl">🌿</div>
            <div className="absolute bottom-0 left-0 text-indigo-300 opacity-20 text-6xl">🌿</div>
            <div className="absolute bottom-0 right-0 text-indigo-300 opacity-20 text-6xl">🌿</div>
            
            {/* Certificate content */}
            <div className="text-indigo-600 text-2xl font-serif font-bold mb-2">Certificate of Achievement</div>
            <div className="text-lg">Code Go Plantation Learning Platform</div>
            
            <div className="py-6 border-t border-b border-indigo-100 my-4">
              <div className="text-3xl font-bold text-indigo-700 py-2">Plantation Knowledge</div>
              <p className="text-gray-600">This certificate is awarded to</p>
              <p className="text-2xl font-bold py-2">Code Go Member</p>
              <p className="text-gray-600">
                For successfully completing the Plantation Knowledge Quiz
                <br />with a score of
              </p>
              <p className="text-4xl font-bold text-indigo-600 py-2">{Math.round(score)}%</p>
            </div>
            
            <div className="pt-4 text-sm text-gray-500">
              <p>Issued on: {formatDate()}</p>
              <div className="pt-4 mt-4">
                <div className="mx-auto w-36 border-t border-indigo-300"></div>
                <p className="pt-2">Code Go Plantation Learning Platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isDownloading && (
        <div className="text-center text-sm text-gray-500">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-600 border-t-transparent mr-2"></div>
            Generating your certificate...
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizResult;