import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: 'https://ecommerce-project-backend-wm1z.onrender.com/api',
    withCredentials: true, // Required to send/receive HttpOnly cookies
});

// The Interceptor
api.interceptors.response.use(
    (response) => response, // If request is successful, do nothing
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Call your Django MyTokenRefreshView
                // It reads the 'refresh' cookie and sets a new 'access' cookie
                await axios.post('https://ecommerce-project-backend-wm1z.onrender.com/api/token/refresh/', {}, { withCredentials: true });
                
                // Retry the original request that failed
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh also fails, the user must log in again
                Cookies.remove('userName');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;