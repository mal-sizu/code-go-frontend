import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { User } from "../types";
import { toast } from "../hooks/use-toast";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/auth";

export interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          // Verify session with backend
          const response = await axios.get(`${API_BASE_URL}/me`, {
            headers: { Authorization: `Bearer ${user.id}` }
          });
          setCurrentUser(response.data);
        } catch (error) {
          localStorage.removeItem("currentUser");
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
      const user = response.data.user;
      
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.username}!`,
      });
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.response?.data?.error || "Invalid email or password",
      });
      return false;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        username,
        email,
        password
      });
      const user = response.data.user;
      
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      toast({
        title: "Registration successful",
        description: `Welcome to Code Go, ${username}!`,
      });
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.response?.data?.error || "Registration failed",
      });
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  // These can be implemented later with proper API endpoints
  const updateProfile = (userData: Partial<User>) => {};
  const followUser = (userId: string) => {};
  const unfollowUser = (userId: string) => {};

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        followUser,
        unfollowUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
