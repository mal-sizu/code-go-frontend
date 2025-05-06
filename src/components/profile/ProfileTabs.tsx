import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCard from "../posts/PostCard";
import PollCard from "../polls/PollCard";
import MaterialCard from "../learning/MaterialCard";

interface ProfileTabsProps {
  userId: string;
}

const ProfileTabs = ({ userId }: ProfileTabsProps) => {
  const { currentUser } = useAuth();
  const {
    getUserPosts,
    getUserPolls,
    getUserLearningMaterials,
    deletePost,
    deletePoll,
    deleteLearningMaterial,
    updatePost,
    updatePoll,
    updateLearningMaterial
  } = useData();

  const [userPosts, setUserPosts] = useState([]);
  const [userPolls, setUserPolls] = useState([]);
  const [userMaterials, setUserMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  const isOwner = currentUser?.id === userId;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [posts, polls, materials] = await Promise.all([
          getUserPosts(userId),
          getUserPolls(userId),
          getUserLearningMaterials(userId)
        ]);
        setUserPosts(posts);
        setUserPolls(polls);
        setUserMaterials(materials);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [userId]);

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="posts">Posts ({userPosts.length})</TabsTrigger>
        <TabsTrigger value="polls">Polls ({userPolls.length})</TabsTrigger>
        <TabsTrigger value="materials">Materials ({userMaterials.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="posts">
        {userPosts.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No posts yet.</div>
        ) : (
          userPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={isOwner ? () => deletePost(post.id) : undefined}
              onEdit={isOwner ? (data) => updatePost(post.id, data) : undefined}
            />
          ))
        )}
      </TabsContent>

      <TabsContent value="polls">
        {userPolls.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No polls yet.</div>
        ) : (
          userPolls.map(poll => (
            <PollCard
              key={poll.id}
              poll={poll}
              onDelete={isOwner ? () => deletePoll(poll.id) : undefined}
              onEdit={isOwner ? (data) => updatePoll(poll.id, data) : undefined}
            />
          ))
        )}
      </TabsContent>

      <TabsContent value="materials">
        {userMaterials.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No learning materials yet.</div>
        ) : (
          userMaterials.map(material => (
            <MaterialCard
              key={material.id}
              material={material}
              onDelete={isOwner ? () => deleteLearningMaterial(material.id) : undefined}
              onEdit={isOwner ? (data) => updateLearningMaterial(material.id, data) : undefined}
            />
          ))
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
