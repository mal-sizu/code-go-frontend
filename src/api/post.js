import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api/posts";

export const fetchPosts = async () => {
  const res = await axios.get(API_BASE_URL);
  return res.data;
};

export const createPost = async (post) => {
  const res = await axios.post(API_BASE_URL, post);
  return res.data;
};

export const likePost = async (postId, userId) => {
  const res = await axios.post(`${API_BASE_URL}/${postId}/like`, { userId });
  return res.data;
};

export const addComment = async (postId, commentObj) => {
  const res = await axios.post(`${API_BASE_URL}/${postId}/comments`, commentObj);
  return res.data;
};
