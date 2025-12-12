import api from "../services/api";
import { API_ENDPOINTS } from "../config/api";

export const listProjects = async () => {
  const { data } = await api.get(API_ENDPOINTS.PROJECTS.LIST);
  return data;
};

export const getUserProjects = async (userId: string) => {
  const { data } = await api.get(API_ENDPOINTS.PROJECTS.USER_PROJECTS(userId));
  return data;
};

export const getProject = async (id: string) => {
  const { data } = await api.get(API_ENDPOINTS.PROJECTS.GET(id));
  return data;
};

export const createProject = async (payload: { title: string; description?: string; githubLink?: string; imageUrl?: string; tags?: string[] }) => {
  const { data } = await api.post(API_ENDPOINTS.PROJECTS.CREATE, payload);
  return data;
};

export const updateProject = async (id: string, payload: Partial<{ title: string; description: string; githubLink: string; imageUrl: string; tags: string[] }>) => {
  const { data } = await api.put(API_ENDPOINTS.PROJECTS.UPDATE(id), payload);
  return data;
};

export const deleteProject = async (id: string) => {
  const { data } = await api.delete(API_ENDPOINTS.PROJECTS.DELETE(id));
  return data;
};

export default { listProjects, getUserProjects, getProject, createProject, updateProject, deleteProject };


