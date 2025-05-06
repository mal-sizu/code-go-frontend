
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import CreatePollForm from "../components/polls/CreatePollForm";
import PollCard from "../components/polls/PollCard";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PieChart } from "lucide-react";

const Polls = () => {
  const { isAuthenticated } = useAuth();
  const { polls } = useData();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 bg-green-50/50">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-6">
            <PieChart className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-green-800 mb-4">Plantation Community Polls</h1>
          <p className="text-xl text-gray-700 max-w-2xl">
            Join our community to participate in polls about plantation techniques, best practices, and trends.
          </p>
        </div>

        <Button 
          className="text-lg py-6 px-8 bg-green-600 hover:bg-green-700" 
          onClick={() => navigate("/login")}
        >
          Login to Participate
        </Button>
      </div>
    );
  }

  return (
    <div>
      <CreatePollForm />
      
      <div>
        {polls.length > 0 ? (
          polls.map(poll => (
            <PollCard key={poll.id} poll={poll} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No polls yet. Be the first one to create a poll!
          </div>
        )}
      </div>
    </div>
  );
};

export default Polls;
