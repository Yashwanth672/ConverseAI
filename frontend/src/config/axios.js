import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})

// Add request interceptor to include token in every request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('🔐 Token from localStorage:', token ? '✅ Found' : '❌ Not found');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('✅ Authorization header set:', config.headers.Authorization.substring(0, 30) + '...');
        }
        console.log('📡 Request to:', config.baseURL + config.url);
        console.log('📋 Request Method:', config.method?.toUpperCase());
        console.log('📦 Request Data:', config.data);
        console.log('📋 Headers:', config.headers);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('❌ Response Error:', {
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
            errors: error.response?.data?.errors,
            data: error.response?.data
        });
        
        if (error.response?.status === 401) {
            console.error('❌ 401 Unauthorized - Token may be invalid or expired');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
)

export default axiosInstance;   