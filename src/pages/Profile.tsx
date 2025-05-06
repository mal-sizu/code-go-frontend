
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileTabs from "../components/profile/ProfileTabs";
import { User } from "../types";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If no id is provided, show the current user's profile
  const userId = id || currentUser?.id;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !currentUser || !userId) {
    return null;
  }

  // In a real app, you would fetch the user data based on the userId
  // For now, just use the current user
  const profileUser = userId === currentUser.id ? currentUser : {
    id: userId,
    username: "User " + userId,
    email: "user" + userId + "@example.com",
    profileImage: undefined,
    bio: "This is a placeholder for another user's profile.",
    followers: [],
    following: [],
    createdAt: new Date().toISOString()
  };

  return (
    <div>
      <ProfileHeader user={profileUser} />
      <ProfileTabs userId={profileUser.id} />
    </div>
  );
};

export default Profile;
