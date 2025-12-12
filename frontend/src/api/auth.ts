import api from "../services/api";
import { API_ENDPOINTS } from "../config/api";

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export const login = async (payload: AuthCredentials) => {
  const { data } = await api.post(API_ENDPOINTS.AUTH.LOGIN, payload);
  return data;
};

export const register = async (payload: RegisterPayload) => {
  const { data } = await api.post(API_ENDPOINTS.AUTH.REGISTER, payload);
  return data;
};

export const me = async () => {
  const { data } = await api.get(API_ENDPOINTS.AUTH.ME);
  return data;
};

export const updateProfile = async (
  id: string,
  payload: { bio?: string; githubUrl?: string; portfolioUrl?: string; profilePicUrl?: string }
) => {
  const endpoint = API_ENDPOINTS.AUTH.UPDATE_PROFILE.replace(":id", id);
  const { data } = await api.put(endpoint, payload);
  return data;
};

export default { login, register, me, updateProfile };


