import axios from 'axios';
import Cookies from 'js-cookie';

axios.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No token available");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
