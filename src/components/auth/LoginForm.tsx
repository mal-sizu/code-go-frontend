import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit } from "lucide-react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Simple validation
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    
    try {
      // Try logging in
      login(email, password);
      // If we reach here, login was successful
      navigate("/");
    } catch (error) {
      // If login throws an error, show it
      setError(error instanceof Error ? error.message : "Login failed");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md plant-shadow">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <BrainCircuit className="h-12 w-12 text-indigo-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back to Code Go</CardTitle>
          <CardDescription>Login to your account to continue your gardening journey</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-indigo-200 focus-visible:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-indigo-200 focus-visible:ring-indigo-500"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
              Login
            </Button>
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 text-indigo-600 hover:text-indigo-700"
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
