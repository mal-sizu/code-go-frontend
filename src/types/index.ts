
export interface User {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
  bio?: string;
  followers: string[];
  following: string[];
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userProfileImage?: string;
  title: string;
  image?: string;
  description: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
  onDelete?: () => Promise<void>;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  userProfileImage?: string;
  content: string;
  createdAt: string;
}

export interface Poll {
  id: string;
  userId: string;
  username: string;
  userProfileImage?: string;
  question: string;
  options: PollOption[];
  createdAt: string;
  onDelete?: () => Promise<void>;
}

export interface PollOption {
  id: string;
  text: string;
  votes: string[]; // user IDs who voted for this option
}

export interface LearningMaterial {
  id: string;
  userId: string;
  username: string;
  userProfileImage?: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: 'pdf' | 'link';
  createdAt: string;
  onDelete?: () => Promise<void>;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;   // <-- Add this line
  category?: string;
}

export interface DataContextType {
  submitAnswer: (answer: string) => void;
  quizScore: number;
  resetQuiz: () => void;
  currentQuestionIndex: number; // Added this property
}