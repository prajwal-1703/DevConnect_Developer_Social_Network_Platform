import api from "../services/api";
import { API_ENDPOINTS } from "../config/api";

export const listPosts = async () => {
  const { data } = await api.get(API_ENDPOINTS.POSTS.LIST);
  // The backend returns { posts: [...], ... }, so return only the posts array
  return data.posts || [];
};

export const getUserPosts = async (userId: string) => {
  const { data } = await api.get(API_ENDPOINTS.POSTS.USER_POSTS(userId));
  return data;
};

export const getPost = async (id: string) => {
  const { data } = await api.get(API_ENDPOINTS.POSTS.GET(id));
  return data;
};

export const createPost = async (formData: FormData) => {
  const { data } = await api.post(API_ENDPOINTS.POSTS.CREATE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deletePost = async (id: string) => {
  const { data } = await api.delete(API_ENDPOINTS.POSTS.DELETE(id));
  return data;
};

export const likePost = async (id: string) => {
  const { data } = await api.post(API_ENDPOINTS.POSTS.LIKE(id));
  return data;
};

export const unlikePost = async (id: string) => {
  const { data } = await api.post(API_ENDPOINTS.POSTS.UNLIKE(id));
  return data;
};

export default { listPosts, getUserPosts, getPost, createPost, deletePost, likePost, unlikePost };


