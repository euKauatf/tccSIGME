// !!! Pede as parada pro backend através desse arquivo !!!
import axios from "axios"; // Biblioteca para fazer requisições HTTP (🔥 a API rs)

const apiClient = axios.create({
  // Cria uma instância do axios com configurações padrão
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Define o tipo EventData como um subconjunto de Event, omitindo as propriedades id, created_at e updated_at (pra ninguém descobrir isso kj)
type EventData = Omit<Event, "id" | "created_at" | "updated_at">;

// Adiciona um interceptor para adicionar o token de autenticação a cada requisição (não roubarão a API)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// FUNÇÕES PARA FAZER REQUISIÇÕES HTTP
export const getUser = () => apiClient.get("/user");
export const getEvents = () => apiClient.get("/event");
export const getEventById = (id: number) => apiClient.get(`/event/${id}`);
export const createEvent = (eventData: Partial<EventData>) =>
  apiClient.post("/event", eventData);

export const updateEvent = (id: number, eventData: Partial<EventData>) =>
  apiClient.put(`/event/${id}`, eventData);
export const deleteEvent = (id: number) => apiClient.delete(`/event/${id}`);

export const subscribeToEvent = (eventId: number) =>
  apiClient.post(`/event/${eventId}/subscribe`);
export const unsubscribeFromEvent = (eventId: number) =>
  apiClient.delete(`/event/${eventId}/unsubscribe`);

export const getAlunos = () => apiClient.get("/alunos");

export const getAuditLogs = () => apiClient.get("/audit-logs");
export const clearAuditLogs = async () => {
  return apiClient.delete("/audit-logs/clear");
};

export const getSorteio = () => {
  return apiClient.post("/sorteio");
};
export const getSorteioClear = () => {
  return apiClient.post("/sorteio/clear");
};

export const marcarPresenca = (matricula: string, event_id: number) =>
  apiClient.post("/inscricao/marcar-presenca", { matricula, event_id });

export const getPalestrantes = () => apiClient.get("/palestrantes");
export const getPalestranteById = (id: number) =>
  apiClient.get(`/palestrantes/${id}`);
export const createPalestrante = (palestranteData: any) =>
  apiClient.post("/palestrantes", palestranteData);
export const updatePalestrante = (id: number, palestranteData: any) =>
  apiClient.put(`/palestrantes/${id}`, palestranteData);
export const deletePalestrante = (id: number) =>
  apiClient.delete(`/palestrantes/${id}`);
export const searchPalestrantes = (term: string) =>
  apiClient.get(`/palestrantes/search?term=${term}`);

export const getLocais = () => apiClient.get("/locais");
export const getLocalById = (id: number) => apiClient.get(`/locais/${id}`);
export const createLocal = (localData: any) =>
  apiClient.post("/locais", localData);
export const updateLocal = (id: number, localData: any) =>
  apiClient.put(`/locais/${id}`, localData);
export const deleteLocal = (id: number) => apiClient.delete(`/locais/${id}`);
export const searchLocais = (term: string) =>
  apiClient.get(`/locais/search?term=${term}`);

export const exportPdf = async (eventId: number) => {
  try {
    const response = await apiClient.get(`/event/${eventId}/export-pdf`, {
      responseType: "blob", // diz pro axios (biblioteca que linka app com api) pra tratar isso como arquivo
    });

    // criar o link pra baixar o arquivo com a resposta trazida pelo get la da api
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;

    // Tenta extrair o nome do arquivo do header da resposta, ou usa um nome padrão -> faz isso ai mesmo
    const contentDisposition = response.headers["content-disposition"];
    let fileName = "lista-presenca.pdf";
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
      if (fileNameMatch && fileNameMatch.length === 2)
        fileName = fileNameMatch[1];
    }

    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove(); // Limpa o link após o download
  } catch (error) {
    console.error("Erro ao exportar PDF:", error);
    alert("Não foi possível gerar a lista de presença.");
  }
};

export const verifyPassword = (password: string) =>
  apiClient.post("/verify-password", { password });

export const updatePassword = (data: {
  matricula: string;
  senha_antiga: string;
  nova_senha: string;
}) =>
  apiClient.put("/alunos/mudar-senha", {
    matricula: data.matricula,
    old_password: data.senha_antiga,
    new_password: data.nova_senha,
  });

export default apiClient;
