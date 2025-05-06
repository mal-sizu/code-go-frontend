import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Poll, PollOption } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, X, Save, Pencil } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PollCardProps {
  poll: Poll;
  onDelete?: () => void;
  onEdit?: (data: Partial<Poll>) => void;
}

const PollCard = ({ poll, onDelete, onEdit }: PollCardProps) => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { votePoll, updatePoll } = useData();
  const [isVoting, setIsVoting] = useState(false);
  const [localPoll, setLocalPoll] = useState<Poll>(poll);
  const [pendingVotes, setPendingVotes] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    question: poll.question,
    options: [...poll.options.map(opt => ({ ...opt, text: opt.text }))]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalVotes = localPoll.options.reduce((acc, option) => acc + option.votes.length, 0);
  
  // Track which options the current user has voted for
  const userVotedOptions = currentUser?.id 
    ? localPoll.options.filter(option => option.votes.includes(currentUser.id))
    : [];
  
  // Check if the current user is the creator of the poll
  const isCreator = currentUser?.id === localPoll.userId;
  
  // Debug information
  useEffect(() => {
    if (currentUser?.id) {
      console.debug('Poll debug information:');
      console.debug('User ID:', currentUser.id);
      console.debug('Poll ID:', localPoll.id);
      console.debug('Poll creator ID:', localPoll.userId);
      console.debug('Is creator:', isCreator);
      console.debug('User voted options:', userVotedOptions);
      console.debug('Pending votes:', pendingVotes);
      console.debug('All options:', localPoll.options);
    }
  }, [localPoll, currentUser?.id, pendingVotes, isCreator]);

  // When component mounts or poll changes, clear pending votes
  useEffect(() => {
    setPendingVotes([]);
  }, [poll.id]);

  const handleVote = async (optionId: string) => {
    // Only prevent voting if user is not logged in or a vote is in progress
    if (!currentUser?.id || isVoting) {
      console.debug('Vote prevented:', !currentUser?.id ? 'Not logged in' : 'Vote in progress');
      return;
    }

    // Check if user has already voted for this specific option
    const hasVotedForThisOption = userVotedOptions.some(option => option.id === optionId) || 
                                  pendingVotes.includes(optionId);
    
    console.debug('Attempting to vote for option:', optionId);
    console.debug('Has already voted for this option:', hasVotedForThisOption);
    
    if (hasVotedForThisOption) {
      toast({
        title: "Already selected",
        description: "You've already voted for this option.",
        variant: "default"
      });
      return;
    }

    setIsVoting(true);
    console.debug('Setting voting state to true');

    // Add to pending votes to prevent double clicks
    setPendingVotes(prev => [...prev, optionId]);

    // Optimistically update localPoll
    const updatedOptions = localPoll.options.map(option =>
      option.id === optionId
        ? { ...option, votes: [...option.votes, currentUser.id] }
        : option
    );
    
    const optimisticPoll = { ...localPoll, options: updatedOptions };
    console.debug('Optimistically updated poll:', optimisticPoll);
    setLocalPoll(optimisticPoll);

    try {
      console.debug('Calling votePoll API...');
      
      // Check if we need to remove existing vote first
      if (userVotedOptions.length > 0) {
        console.debug('User has existing votes, we need to handle this');
        // Inform user about the API limitation
        toast({
          title: "API Limitation",
          description: "The server only allows one vote per poll. Your previous selection will be replaced.",
          variant: "default"
        });
      }
      
      await votePoll(localPoll.id, optionId);
      console.debug('Vote successful');
      
      toast({
        title: "Vote recorded",
        description: "Your vote has been added successfully.",
        variant: "default"
      });
      
      // If successful, refresh the poll data to get the correct state from server
      // This would be implemented in a real app - we're simulating it here
      // Ideally would call something like: await refreshPoll(localPoll.id);
      
    } catch (error) {
      console.error('Voting failed:', error);
      
      // Extract detailed error information
      let errorMessage = "There was an error recording your vote.";
      let statusCode = 0;
      
      if (error && typeof error === 'object') {
        if ('response' in error && error.response && typeof error.response === 'object') {
          if ('data' in error.response && error.response.data) {
            errorMessage = error.response.data.message || errorMessage;
          }
          if ('status' in error.response) {
            statusCode = error.response.status;
          }
        }
        if ('message' in error) {
          errorMessage = error.message || errorMessage;
        }
      }
      
      console.debug('Error details:', { errorMessage, statusCode });
      
      if (statusCode === 409) {
        errorMessage = "The server only allows one vote per poll. Please refresh the page to see your current vote.";
      }
      
      toast({
        variant: "destructive",
        title: "Voting failed",
        description: errorMessage,
      });

      // Rollback UI state on error
      console.debug('Rolling back to previous state');
      
      // Remove from pending votes
      setPendingVotes(prev => prev.filter(id => id !== optionId));
      
      // Rollback the poll state
      setLocalPoll(poll);
    } finally {
      setIsVoting(false);
      console.debug('Setting voting state to false');
    }
  };

  const calculatePercentage = (option: PollOption): number => {
    if (totalVotes === 0) return 0;
    return Math.round((option.votes.length / totalVotes) * 100);
  };

  // Check if an option appears to be selected - either in confirmed votes or pending
  const isOptionSelected = (optionId: string) => {
    return userVotedOptions.some(opt => opt.id === optionId) || 
           pendingVotes.includes(optionId);
  };

  // Handle edit button click
  const handleEdit = () => {
    setIsEditing(true);
    setEditFormData({
      question: localPoll.question,
      options: [...localPoll.options.map(opt => ({ ...opt, text: opt.text }))]
    });
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // Handle form field changes
  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData(prev => ({
      ...prev,
      question: e.target.value
    }));
  };

  // Handle option text changes
  const handleOptionChange = (optionId: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      options: prev.options.map(opt => 
        opt.id === optionId ? { ...opt, text: value } : opt
      )
    }));
  };

  // Handle form submission
  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editFormData.question.trim()) {
      toast({
        title: "Validation error",
        description: "Question cannot be empty",
        variant: "destructive"
      });
      return;
    }

    // Check for empty options
    const hasEmptyOption = editFormData.options.some(opt => !opt.text.trim());
    if (hasEmptyOption) {
      toast({
        title: "Validation error",
        description: "Option text cannot be empty",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for API
      const updatedPollData = {
        question: editFormData.question,
        options: editFormData.options.map(opt => ({
          id: opt.id,
          text: opt.text,
          votes: opt.votes // Keep original votes
        }))
      };

      // Call API to update poll
      await updatePoll(localPoll.id, updatedPollData);

      // Update local state
      setLocalPoll(prev => ({
        ...prev,
        question: editFormData.question,
        options: editFormData.options
      }));

      // Close edit form
      setIsEditing(false);

      // Show success message
      toast({
        title: "Poll updated",
        description: "Your poll has been updated successfully",
        variant: "default"
      });
      
      // Call onEdit callback if provided
      if (onEdit) {
        onEdit(updatedPollData);
      }
    } catch (error) {
      console.error("Failed to update poll:", error);
      
      let errorMessage = "There was an error updating your poll.";
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

  // Handle delete button click
  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    } else {
      toast({
        title: "Delete function",
        description: "The delete handler is not implemented yet.",
        variant: "default"
      });
    }
  };

  return (
    <Card className="mb-6 border-green-100 plant-shadow">
      <div className="flex items-center justify-between p-4 border-b border-green-100">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={localPoll.userProfileImage} alt={localPoll.username} />
            <AvatarFallback>
              {(localPoll.username?.substring(0, 2) || 'US').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{localPoll.username || 'Anonymous'}</p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(localPoll.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>

        {isCreator && !isEditing && (
          <div className="flex gap-2">
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
          <div className="flex gap-2">
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
            <h3 className="text-lg font-semibold mb-4">{localPoll.question}</h3>
            
            {userVotedOptions.length > 0 && (
              <p className="text-sm text-gray-600 mb-3">
                Note: The server only allows one vote per poll. Selecting another option will replace your current vote.
              </p>
            )}
            
            {userVotedOptions.length === 0 && localPoll.options.length > 0 && (
              <p className="text-sm text-gray-600 mb-3">
                Select an option to vote:
              </p>
            )}

            <div className="space-y-3">
              {localPoll.options.map((option) => {
                const percentage = calculatePercentage(option);
                const isSelected = isOptionSelected(option.id);
                const isPending = pendingVotes.includes(option.id) && !userVotedOptions.some(opt => opt.id === option.id);

                return (
                  <div key={option.id} className="relative">
                    {isSelected ? (
                      <div className={`border rounded-lg p-3 space-y-1 ${isPending ? 'border-yellow-300 bg-yellow-50' : 'border-green-300 bg-green-50'}`}>
                        <div className="flex justify-between mb-1">
                          <span>{option.text} {isPending && <span className="text-xs text-yellow-600">(pending...)</span>}</span>
                          <span className="font-medium">{percentage}%</span>
                        </div>
                        <Progress 
                          value={percentage} 
                          className={`h-2 ${isPending ? 'bg-yellow-100' : 'bg-green-100'}`}
                        />
                        <div className="text-xs text-gray-500 text-right mt-1">
                          {option.votes.length} {option.votes.length === 1 ? 'vote' : 'votes'}
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full justify-start font-normal hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                        onClick={() => handleVote(option.id)}
                        disabled={!currentUser || isVoting}
                      >
                        {option.text}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>

            {!currentUser && (
              <p className="text-sm text-center text-gray-500 mt-3">
                Login to vote in this poll
              </p>
            )}

            <div className="text-sm text-gray-500 mt-4">
              {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'} total
              {userVotedOptions.length > 0 && ` • ${userVotedOptions.length} ${userVotedOptions.length === 1 ? 'option' : 'options'} selected`}
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmitEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="poll-question">Poll Question</Label>
              <Input 
                id="poll-question"
                value={editFormData.question}
                onChange={handleQuestionChange}
                placeholder="Enter your poll question"
                disabled={isSubmitting}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Options</Label>
              {editFormData.options.map((option, index) => (
                <div key={option.id} className="flex items-center gap-2 mt-2">
                  <Input 
                    value={option.text}
                    onChange={(e) => handleOptionChange(option.id, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    disabled={isSubmitting}
                    className="w-full"
                  />
                </div>
              ))}
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

export default PollCard;