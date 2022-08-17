import Axios from "axios";

const axios = Axios.create();

axios.interceptors.request.use(
  (config) => {
    const auth_token = localStorage.getItem("token");

    config.headers["Authorization"] = "Bearer " + auth_token;
    return config;
  },
  (error) => Promise.reject(error)
);

export default axios;
