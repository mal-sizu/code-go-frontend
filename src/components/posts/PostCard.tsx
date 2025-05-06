import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Post } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MessageCircle, Heart, Trash2, Edit2, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface PostCardProps {
  post: Post;
  onDelete?: () => void;
  onEdit?: (data: Partial<Post>) => void;
}
const PostCard = ({ post, onDelete, onEdit }: PostCardProps) => {
  const { currentUser, isAuthenticated, followUser, unfollowUser } = useAuth();
  const { likePost, unlikePost, addComment } = useData();
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedDescription, setEditedDescription] = useState(post.description);

  const isLiked = currentUser && post.likes.includes(currentUser.id);
  const isOwnPost = currentUser && post.userId === currentUser.id;
  const isFollowing = currentUser && currentUser.following.includes(post.userId);

  const handleLikeToggle = () => {
    if (!currentUser) return;
    
    if (isLiked) {
      unlikePost(post.id);
    } else {
      likePost(post.id);
    }
  };

  const handleFollowToggle = () => {
    if (!currentUser || isOwnPost) return;
    
    if (isFollowing) {
      unfollowUser(post.userId);
    } else {
      followUser(post.userId);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    addComment(post.id, comment);
    setComment("");
  };

  const handleDeletePost = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const handleEditPost = () => {
    setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle(post.title);
    setEditedDescription(post.description);
  };
  
  const handleSaveEdit = () => {
    if (onEdit) {
      onEdit({
        ...post,
        title: editedTitle,
        description: editedDescription
      });
      setIsEditing(false);
    }
  };

  return (
    <Card className="mb-6 overflow-hidden plant-card border-green-100">
      <div className="flex items-center justify-between p-4 border-b border-green-100">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={post.userProfileImage} alt={post.username} />
            <AvatarFallback>{post.username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{post.username}</p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isOwnPost && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEditPost}
                className="text-gray-600 hover:text-blue-600"
                aria-label="Edit post"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeletePost}
                className="text-gray-600 hover:text-red-600"
                aria-label="Delete post"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
          
          {!isOwnPost && isAuthenticated && (
            <Button 
              size="sm" 
              variant={isFollowing ? "outline" : "default"}
              onClick={handleFollowToggle}
              className={isFollowing ? "border-green-500 text-green-500" : "bg-green-500 hover:bg-green-600"}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}
        </div>
      </div>

      <CardContent className="p-0">
        {isEditing ? (
          <div className="p-4 space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <Input
                id="title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full border-green-200"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <Textarea
                id="description"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="w-full resize-none border-green-200"
                rows={4}
              />
            </div>
            
            <div className="flex space-x-2 justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCancelEdit}
                className="border-gray-300"
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSaveEdit}
                className="bg-green-600 hover:bg-green-700"
                disabled={!editedTitle.trim() || !editedDescription.trim()}
              >
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="font-semibold text-lg p-4 pb-2">{post.title}</h3>
            
            {post.image && (
              <div className="relative h-64">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <p className="p-4 pt-2 text-gray-700">{post.description}</p>
          </>
        )}
      </CardContent>

      <CardFooter className="flex flex-col p-0">
        <div className="flex items-center justify-between p-4 border-t border-green-100">
          <div className="flex space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              className={`flex items-center space-x-1 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
              onClick={handleLikeToggle}
              disabled={!isAuthenticated}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              <span>{post.likes.length}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center space-x-1 text-gray-500"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-5 w-5" />
              <span>{post.comments.length}</span>
            </Button>
          </div>
        </div>

        {showComments && (
          <div className="p-4 pt-0 space-y-4">
            {isAuthenticated && (
              <form onSubmit={handleCommentSubmit} className="flex space-x-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="resize-none border-green-200"
                  rows={1}
                />
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 shrink-0"
                  disabled={!comment.trim()}
                >
                  Post
                </Button>
              </form>
            )}

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {post.comments.length === 0 ? (
                <p className="text-gray-500 text-sm">No comments yet.</p>
              ) : (
                post.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-2 text-sm">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={comment.userProfileImage} alt={comment.username} />
                      <AvatarFallback>{comment.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-baseline space-x-2">
                        <p className="font-medium">{comment.username}</p>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default PostCard;