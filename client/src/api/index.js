import Axios from "axios";

const axios = Axios.create();

axios.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem("token");

    config.headers["Authorization"] = "Bearer " + authToken;
    return config;
  },
  (error) => Promise.reject(error)
);

export const auth = async () => {
  const res = await axios.get("/api/auth");
  return res.data;
};

export const signup = async (data) => {
  const res = await axios.post("/api/signup", data);
  return res.data;
};

export const login = async (data) => {
  const res = await axios.post("/api/login", data);
  return res.data;
};

export const getAllUsers = async ({ search, size }) => {
  const res = await axios.get(
    `/api/user?search=${search || ""}&size=${size || 20}`
  );
  return res.data;
};

export const setAvatar = async ({ imgUrl }) => {
  const res = await axios.put(`/api/avatar`, { imgUrl });
  return res.data;
};

export const deleteUser = async () => {
  const res = await axios.delete(`/api/delete`);
  return res.data;
};

export const sendMessage = async (data) => {
  const res = await axios.post("/api/message", data);
  return res.data;
};

export const getMessage = async ({ user, size }) => {
  const res = await axios.get(`/api/message/${user}?size=${size || 20}`);
  return res.data;
};

export const getUserById = async (id) => {
  const res = await axios.get(`/api/user/${id}`);
  return res.data;
};
