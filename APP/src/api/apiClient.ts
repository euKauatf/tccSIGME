import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

type EventData = Omit<Event, 'id' | 'created_at' | 'updated_at'>;

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export const getEvents = () => apiClient.get('/event');
export const getEventById = (id: number) => apiClient.get(`/event/${id}`);
export const createEvent = (eventData: Partial<EventData>) => apiClient.post('/event', eventData);
export const updateEvent = (id:number, eventData: Partial<EventData>) => apiClient.put(`/event/${id}`, eventData);
export const deleteEvent = (id:number) => apiClient.delete(`/event/${id}`);

export default apiClient;