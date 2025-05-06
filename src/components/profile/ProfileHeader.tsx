
import { useState } from "react";
import { User } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  const { currentUser, followUser, unfollowUser, updateProfile } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(user.profileImage || "");
  const [bio, setBio] = useState(user.bio || "");

  const isOwnProfile = currentUser && user.id === currentUser.id;
  const isFollowing = currentUser && currentUser.following.includes(user.id);

  const handleFollowToggle = () => {
    if (!currentUser || isOwnProfile) return;
    
    if (isFollowing) {
      unfollowUser(user.id);
    } else {
      followUser(user.id);
    }
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateProfile({
      profileImage: profileImage.trim() || undefined,
      bio: bio.trim() || undefined
    });
    
    setEditOpen(false);
  };

  return (
    <>
      <div className="bg-white shadow rounded-lg p-6 mb-6 plant-shadow">
        <div className="flex flex-col md:flex-row items-center">
          <Avatar className="h-20 w-20 md:h-24 md:w-24 border-4 border-green-100">
            <AvatarImage src={user.profileImage} alt={user.username} />
            <AvatarFallback className="text-2xl">{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left flex-1">
            <h2 className="text-2xl font-bold">{user.username}</h2>
            <p className="text-gray-600 mt-1">{user.bio || "No bio provided"}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start mt-4 space-x-6">
              <div>
                <span className="font-bold">{user.followers.length}</span>
                <span className="text-gray-600 ml-1">Followers</span>
              </div>
              <div>
                <span className="font-bold">{user.following.length}</span>
                <span className="text-gray-600 ml-1">Following</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            {isOwnProfile ? (
              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-green-200 hover:bg-green-50 hover:text-green-700">
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="profileImage">Profile Image URL</Label>
                      <Input
                        id="profileImage"
                        placeholder="https://example.com/image.jpg"
                        value={profileImage}
                        onChange={(e) => setProfileImage(e.target.value)}
                        className="border-green-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="border-green-200"
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            ) : (
              <Button
                className={isFollowing 
                  ? "border-green-500 text-green-500" 
                  : "bg-green-600 hover:bg-green-700"}
                variant={isFollowing ? "outline" : "default"}
                onClick={handleFollowToggle}
                disabled={!currentUser}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;
