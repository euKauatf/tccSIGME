// !!! Pede as parada pro backend através desse arquivo !!!
import axios from 'axios'; // Biblioteca para fazer requisições HTTP (🔥 a API rs)
const apiClient = axios.create({ // Cria uma instância do axios com configurações padrão
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

// Define o tipo EventData como um subconjunto de Event, omitindo as propriedades id, created_at e updated_at (pra ninguém descobrir isso kj)
type EventData = Omit<Event, 'id' | 'created_at' | 'updated_at'>;

// Adiciona um interceptor para adicionar o token de autenticação a cada requisição (não roubarão a API)
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});




// FUNÇÕES PARA FAZER REQUISIÇÕES HTTP
export const getUser = () => apiClient.get('/user');
export const getEvents = () => apiClient.get('/event');
export const getEventById = (id: number) => apiClient.get(`/event/${id}`);
export const createEvent = (eventData: Partial<EventData>) => apiClient.post('/event', eventData);
export const updateEvent = (id:number, eventData: Partial<EventData>) => apiClient.put(`/event/${id}`, eventData);
export const deleteEvent = (id:number) => apiClient.delete(`/event/${id}`);
export const subscribeToEvent = (eventId: number) => apiClient.post(`/event/${eventId}/subscribe`);


export default apiClient;