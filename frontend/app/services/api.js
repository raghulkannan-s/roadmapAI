import axios from 'axios';
import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  
  if (session?.user?.provider_id) {
    config.headers.Authorization = `Bearer ${session.user.provider_id}`;
    console.log('Token set:', config.headers.Authorization);
  } else {
    console.log('No token found in session');
  }
  return config;
});

const get_all_roadmaps = async () => {
  const response = await api.get("/roadmap/get/all");
  return response.data;
};

const get_my_roadmaps = async () => {
  const response = await api.get("/roadmap/get/my");
  return response.data;
};

const get_roadmap_by_id = async (id) => {
  const response = await api.get(`/roadmap/get/${id}`);
  return response.data;
};

const generate_roadmap = async (prompt) => {
  const response = await api.post("/roadmap/generate", { prompt });
  return response.data;
};

export { get_all_roadmaps, get_my_roadmaps, generate_roadmap, get_roadmap_by_id };
