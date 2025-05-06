
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-indigo-50/50">
      <Navbar />
      <div className="flex">
        {isAuthenticated && <Sidebar />}
        <main className={`flex-1 p-4 ${isAuthenticated ? 'md:ml-64' : ''}`}>
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
