import axios from "axios";

export default (authContext) => {
  const AUTH_TOKEN = localStorage.getItem("access_token");
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
  });

  console.log(AUTH_TOKEN, "AUTH_TOKEN");

  axiosInstance.interceptors.response.use(
    (response) =>
      new Promise((resolve, reject) => {
        resolve(response);
      }),
    (error) => {
      console.log(error, "error in axios instance");
      if (!error.response) {
        return new Promise((resolve, reject) => {
          reject(error);
        });
      }

      if (error.response.status === 401) {
        localStorage.removeItem("token");
        authContext.dispatch({ type: "LOG_OUT" });
      } else {
        return new Promise((resolve, reject) => {
          reject(error);
        });
      }
    }
  );

  return axiosInstance;
};
