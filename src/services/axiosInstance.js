import axios from 'axios';
const axiosInstance = axios.create({
    baseURL: 'http://172.30.17.115:8082/',
    timeout: 1000,
    // headers: authHeader()
});
axiosInstance.interceptors.request.use(
    config => {
        if (config.url && config.url.startsWith("/api/")) {
            config.url = config.url.replace("/api/", "/");
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default axiosInstance;