import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const httpClient = axios.create({
  baseURL: `http://44.195.125.80:9828/api/`, 

});

// ✅ Request Interceptor
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    config.metadata = { startTime: new Date() };
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor
httpClient.interceptors.response.use(
  (response) => {
    const endTime = new Date();
    const startTime = response.config.metadata?.startTime;
    const responseTime = startTime ? endTime - startTime : null;

    // Optionally log timing:
    if (responseTime !== null)
      console.log(`Response Time: ${responseTime} ms for ${response.config.url}`);

    return response;
  },
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || "An error occurred";
    const originalRequest = error.config;

    console.error("API Error:", {
      status,
      message,
      url: originalRequest?.url,
      method: originalRequest?.method,
    });

    switch (status) {
      case 401:
        // Only show session expired popup for endpoints other than login
        if (!originalRequest?._retry && !originalRequest?.url?.includes("auth/login")) {
          originalRequest._retry = true;
          Swal.fire({
            title: "Session Expired",
            text: "Your session has expired. Please log in again.",
            icon: "warning",
            confirmButtonText: "OK",
            allowOutsideClick: false,
          }).then(() => {
            localStorage.clear();
            window.location.href = "/admin-panel/authentication/login";
          });
        }
        // For login, only show toast (handled in login page)
        break;

      case 403:
        toast.error("Access Denied: " + message);
        break;

      case 404:
        toast.warn(message);
        break;

      case 429:
        toast.warn("Too Many Requests: Please wait before trying again");
        break;

      case 500:
        toast.error("Server Error: " + message);
        break;

      default:
        if (error.code === "ECONNABORTED")
          toast.error("Request timeout. Please try again.");
        else if (error.message === "Network Error")
          toast.error("Network error. Please check your connection.");
        else
          toast.error(message);
    }

    return Promise.reject(error);
  }
);

// ✅ Upload progress tracking
httpClient.defaults.onUploadProgress = (progressEvent) => {
  const percentCompleted = Math.round(
    (progressEvent.loaded * 100) / progressEvent.total
  );
  console.log(`Upload progress: ${percentCompleted}%`);
};

// Export helpers
httpClient.CancelToken = axios.CancelToken;
httpClient.isCancel = axios.isCancel;

export default httpClient;
