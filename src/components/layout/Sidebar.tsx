
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, PieChart, FileText, HelpCircle, User } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  
  const routes = [
    {
      title: "Home",
      icon: <Home className="h-5 w-5" />,
      href: "/",
      active: location.pathname === "/"
    },
    {
      title: "Polls",
      icon: <PieChart className="h-5 w-5" />,
      href: "/polls",
      active: location.pathname === "/polls"
    },
    {
      title: "Learning Materials",
      icon: <FileText className="h-5 w-5" />,
      href: "/learning-materials",
      active: location.pathname === "/learning-materials"
    },
    {
      title: "Quiz",
      icon: <HelpCircle className="h-5 w-5" />,
      href: "/quiz",
      active: location.pathname === "/quiz"
    },
    {
      title: "Profile",
      icon: <User className="h-5 w-5" />,
      href: "/profile",
      active: location.pathname === "/profile"
    }
  ];

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r shadow-sm hidden md:block">
      <div className="p-4 space-y-4">
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              to={route.href}
              className={cn(
                "flex items-center gap-x-2 text-sm font-medium py-3 px-4 rounded-md transition-colors",
                route.active
                  ? "bg-green-100 text-green-900"
                  : "text-gray-700 hover:bg-green-50 hover:text-green-900"
              )}
            >
              {route.icon}
              {route.title}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
