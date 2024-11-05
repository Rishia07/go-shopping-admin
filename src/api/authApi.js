import axios from "../config/axiosConfig";

const API_KEY = import.meta.env.VITE_BACKEND_API_KEY;
const fetchUsersURL = `${API_KEY}/api/users`;

export const login = async (newUser) => {
  const { data } = await axios.post(`${fetchUsersURL}/register`, newUser);
  return data;
};

export const register = async (newUser) => {
  const { data } = await axios.post(`${fetchUsersURL}/register`, newUser);
  return data;
};

export const fetchCurrentUser = async (id) => {
  const { data } = await axios.get(`${fetchUsersURL}/${id}`);
  return data;
};

export const updateUser = async ({ id, updatedUser }) => {
  const { data } = await axios.put(`${fetchUsersURL}/${id}`, updatedUser);
  return data;
};

export const changePassword = async ({ id, updatedPassword }) => {
  const { data } = await axios.put(`${fetchUsersURL}/${id}`, updatedPassword);
  return data;
};
