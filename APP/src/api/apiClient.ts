// src/api/apiClient.js
import axios from 'axios';

// Cria uma instância do Axios com a URL base da nossa API
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

// "Interceptor": uma função que roda antes de toda requisição ser enviada
apiClient.interceptors.request.use(config => {
    // Pega o token salvo no navegador
    const token = localStorage.getItem('authToken');
    // Se o token existir, adiciona ao cabeçalho da requisição
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default apiClient;