import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { Post, Comment, Poll, LearningMaterial, QuizQuestion } from "../types";
import { useAuth } from "./AuthContext";
import axios from "axios";
import { toast } from "../hooks/use-toast";
 
const API_BASE_URL = "http://localhost:8081/api";
 
interface DataContextType {
  posts: Post[];
  polls: Poll[];
  learningMaterials: LearningMaterial[];
  quizQuestions: QuizQuestion[];
  currentQuiz: QuizQuestion[];
  currentQuestionIndex: number;
  quizScore: number;
  addPost: (
    post: Omit<
      Post,
      "id" | "userId" | "username" | "userProfileImage" | "createdAt" | "likes" | "comments"
    >
  ) => Promise<void>;
  updatePost: (postId: string, data: Partial<Post>) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  unlikePost: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  addPoll: (
    poll: Omit<Poll, "id" | "userId" | "username" | "userProfileImage" | "createdAt">
  ) => Promise<void>;
  deletePoll: (pollId: string) => Promise<void>;
  votePoll: (pollId: string, optionId: string) => Promise<void>;
  addLearningMaterial: (
    material: Omit<
      LearningMaterial,
      "id" | "userId" | "username" | "userProfileImage" | "createdAt"
    >
  ) => Promise<void>;
  deleteLearningMaterial: (materialId: string) => Promise<void>;
  updateLearningMaterial: (
    materialId: string,
    data: Partial<LearningMaterial>
  ) => Promise<void>;
  getUserPosts: (userId: string) => Post[];
  getUserPolls: (userId: string) => Poll[];
  getUserLearningMaterials: (userId: string) => LearningMaterial[];
  getRandomQuizQuestions: (count: number) => QuizQuestion[];
  startQuiz: () => Promise<void>;
  submitAnswer: (answer: string) => void;
  resetQuiz: () => void;
  updatePoll: (pollId: string, data: Partial<Poll>) => Promise<void>;
}
 
const DataContext = createContext<DataContextType | undefined>(undefined);
 
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [learningMaterials, setLearningMaterials] = useState<LearningMaterial[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
 
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [postsResponse, pollsResponse, materialsResponse, quizResponse] =
          await Promise.all([
            axios.get(`${API_BASE_URL}/posts`),
            axios.get(`${API_BASE_URL}/polls`),
            axios.get(`${API_BASE_URL}/learning-materials`),
            axios.get(`${API_BASE_URL}/quizzes`), // Fetch quiz questions
          ]);
        setPosts(postsResponse.data);
        setPolls(pollsResponse.data);
        setLearningMaterials(materialsResponse.data);
        setQuizQuestions(quizResponse.data);
        console.log(quizResponse.data); // Debugging line
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Loading error",
          description: "Failed to fetch initial data from server",
        });
      }
    };
 
    fetchInitialData();
  }, []);
 
  // Posts operations
  const addPost = async (
    post: Omit<
      Post,
      "id" | "userId" | "username" | "userProfileImage" | "createdAt" | "likes" | "comments"
    >
  ) => {
    if (!currentUser) return;
 
    try {
      const response = await axios.post(`${API_BASE_URL}/posts`, {
        ...post,
        userId: currentUser.id,
        username: currentUser.username,
        userProfileImage: currentUser.profileImage,
      });
 
      setPosts((prev) => [response.data, ...prev]);
      toast({
        title: "Post created",
        description: "Your post has been published successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Post creation failed",
        description: "Could not create post. Please try again.",
      });
    }
  };
 
  const updatePost = async (postId: string, post: Partial<Post>) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/posts/${postId}`, post);
      setPosts(prev => prev.map(p => p.id === postId ? response.data : p));
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to update post" });
    }
  };
 
  const deletePost = async (postId: string) => {
    if (!currentUser) return;
 
    try {
      await axios.delete(`${API_BASE_URL}/posts/${postId}`);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
      toast({
        title: "Post deleted",
        description: "Your post has been removed.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Deletion failed",
        description: "Could not delete post. Please try again.",
      });
    }
  };
 
  const likePost = async (postId: string) => {
    if (!currentUser) return;
 
    try {
      const response = await axios.post(`${API_BASE_URL}/posts/${postId}/like`, {
        userId: currentUser.id,
      });
      setPosts((prev) =>
        prev.map((post) => (post.id === postId ? response.data : post))
      );
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Like failed",
        description: "Could not like post. Please try again.",
      });
    }
  };
 
  const unlikePost = async (postId: string) => {
    if (!currentUser) return;
 
    try {
      const response = await axios.delete(`${API_BASE_URL}/posts/${postId}/like`, {
        data: { userId: currentUser.id },
      });
      setPosts((prev) =>
        prev.map((post) => (post.id === postId ? response.data : post))
      );
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Unlike failed",
        description: "Could not unlike post. Please try again.",
      });
    }
  };
 
  const addComment = async (postId: string, content: string) => {
    if (!currentUser || !content.trim()) return;
 
    try {
      const response = await axios.post(`${API_BASE_URL}/posts/${postId}/comments`, {
        userId: currentUser.id,
        username: currentUser.username,
        userProfileImage: currentUser.profileImage,
        content,
      });
 
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, comments: response.data.comments } : post
        )
      );
 
      toast({
        title: "Comment added",
        description: "Your comment has been posted.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Comment failed",
        description: "Could not add comment. Please try again.",
      });
    }
  };
 
  // Poll operations
  const addPoll = async (
    poll: Omit<Poll, "id" | "userId" | "username" | "userProfileImage" | "createdAt">
  ) => {
    if (!currentUser) return;
 
    try {
      const response = await axios.post(`${API_BASE_URL}/polls`, {
        ...poll,
        options: poll.options.map((option) => ({
          ...option,
          votes: [], // Initialize votes as empty array
        })),
        userId: currentUser.id,
        username: currentUser.username,
        userProfileImage: currentUser.profileImage,
      });
 
      setPolls((prev) => [response.data, ...prev]);
      toast({
        title: "Poll created",
        description: "Your poll has been published successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Poll creation failed",
        description: "Could not create poll. Please try again.",
      });
    }
  };
  const updatePoll = async (pollId: string, data: Partial<Poll>) => {
    if (!currentUser) return;
    
    try {
      const response = await axios.put(`${API_BASE_URL}/polls/${pollId}`, data);
      setPolls(prev => prev.map(poll => 
        poll.id === pollId ? response.data : poll
      ));
    } catch (error) {
      toast({ 
        variant: "destructive", 
        title: "Failed to update poll" 
      });
    }
  };

  const deletePoll = async (pollId: string) => {
    if (!currentUser) return;
 
    try {
      await axios.delete(`${API_BASE_URL}/polls/${pollId}`);
      setPolls((prev) => prev.filter((poll) => poll.id !== pollId));
      toast({
        title: "Poll deleted",
        description: "Your poll has been removed.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Deletion failed",
        description: "Could not delete poll. Please try again.",
      });
    }
  };
  // Removed duplicate updatePoll function
 
  const votePoll = async (pollId: string, optionId: string) => {
    if (!currentUser?.id) return;
  
    try {
      const response = await axios.post(`${API_BASE_URL}/polls/${pollId}/vote`, {
        userId: currentUser.id,
        optionId: optionId,
      });
  
      setPolls(prev => prev.map(poll =>
        poll.id === pollId ? response.data : poll
      ));
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast({
          variant: "destructive",
          title: "You already voted",
          description: "You cannot vote again unless vote changing is enabled.",
        });
      } else {
        toast({ variant: "destructive", title: "Voting failed" });
      }
    }
  };
  
 
  // Learning Materials operations
  const addLearningMaterial = async (
    material: Omit<
      LearningMaterial,
      "id" | "userId" | "username" | "userProfileImage" | "createdAt"
    >
  ) => {
    if (!currentUser) return;
 
    try {
      const response = await axios.post(`${API_BASE_URL}/learning-materials`, {
        ...material,
        userId: currentUser.id,
        username: currentUser.username,
        userProfileImage: currentUser.profileImage,
      });
      setLearningMaterials((prev) => [response.data, ...prev]);
      toast({
        title: "Material shared",
        description: "Your learning material has been shared successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to share material",
        description: "Could not share material. Please try again.",
      });
    }
  };
 
  const deleteLearningMaterial = async (materialId: string) => {
    if (!currentUser) return;
 
    try {
      await axios.delete(`${API_BASE_URL}/learning-materials/${materialId}`);
      setLearningMaterials((prev) => prev.filter((m) => m.id !== materialId));
      toast({
        title: "Material deleted",
        description: "Your learning material has been removed.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to delete material",
        description: "Could not delete material. Please try again.",
      });
    }
  };

  const updateLearningMaterial = async (
    materialId: string,
    data: Partial<LearningMaterial>
  ) => {
    if (!currentUser) return;
 
    try {
      const response = await axios.put(`${API_BASE_URL}/learning-materials/${materialId}`, data);
      setLearningMaterials((prev) =>
        prev.map((m) => (m.id === materialId ? response.data : m))
      );
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update material",
        description: "Could not update material. Please try again.",
      });
    }
  };
 
  // Quiz operations
  const startQuiz = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/quizzes/random`);
      setCurrentQuiz(response.data);
      console.log(response.data);
      setCurrentQuestionIndex(0);
      setQuizScore(0);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to start quiz",
        description: "Could not load quiz questions. Please try again.",
      });
    }
    
  };
 
  const submitAnswer = (answer: string) => {
    const correctAnswer = currentQuiz[currentQuestionIndex]?.correctAnswer;
    if (answer === correctAnswer) {
      setQuizScore((prev) => prev + 1);
    }
    setCurrentQuestionIndex((prev) => prev + 1);
  };
 
  const resetQuiz = () => {
    setCurrentQuiz([]);
    setCurrentQuestionIndex(0);
    setQuizScore(0);
  };
 
  // Helper methods
  const getUserPosts = (userId: string) => posts.filter((post) => post.userId === userId);
  const getUserPolls = (userId: string) => polls.filter((poll) => poll.userId === userId);
  const getUserLearningMaterials = (userId: string) =>
    learningMaterials.filter((material) => material.userId === userId);
  const getRandomQuizQuestions = (count: number) =>
    [...quizQuestions].sort(() => 0.5 - Math.random()).slice(0, count);
 
return (
    <DataContext.Provider
      value={{
        posts,
        polls,
        learningMaterials,
        quizQuestions,
        currentQuiz,
        currentQuestionIndex,
        quizScore,
        addPost,
        updatePost,
        deletePost,
        likePost,
        unlikePost,
        addComment,
        addPoll,
        deletePoll,
        updatePoll,
        votePoll,
        addLearningMaterial,
        deleteLearningMaterial,
        getUserPosts,
        getUserPolls,
        getUserLearningMaterials,
        updateLearningMaterial,
        getRandomQuizQuestions,
        startQuiz,
        submitAnswer,
        resetQuiz,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
 
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
 