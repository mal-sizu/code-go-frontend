
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { BrainCircuit } from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-gradient-to-r from-indigo-700 to-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <BrainCircuit className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold">Code Go</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center">
                  <Avatar className="h-8 w-8 border-2 border-white">
                    <AvatarImage src={currentUser?.profileImage} alt={currentUser?.username} />
                    <AvatarFallback>{currentUser?.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Link>
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-white hover:bg-indigo-800"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-white hover:bg-indigo-800"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button 
                  className="bg-indigo-800 hover:bg-indigo-900 text-white"
                  onClick={() => navigate("/register")}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
