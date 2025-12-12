import api from "../services/api";
import { API_ENDPOINTS } from "../config/api";

export const getProfile = async (id: string) => {
  const { data } = await api.get(API_ENDPOINTS.USERS.PROFILE(id));
  return data;
};

export const updateUser = async (formData: FormData) => {
  const { data } = await api.put(API_ENDPOINTS.USERS.UPDATE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const follow = async (id: string) => {
  const { data } = await api.post(API_ENDPOINTS.USERS.FOLLOW(id));
  return data;
};

export const unfollow = async (id: string) => {
  const { data } = await api.post(API_ENDPOINTS.USERS.UNFOLLOW(id));
  return data;
};

export const getFollowers = async (id: string) => {
  const { data } = await api.get(API_ENDPOINTS.USERS.FOLLOWERS(id));
  return data;
};

export const getFollowing = async (id: string) => {
  const { data } = await api.get(API_ENDPOINTS.USERS.FOLLOWING(id));
  return data;
};

export default { getProfile, updateUser, follow, unfollow, getFollowers, getFollowing };


