import { useState, useEffect, useMemo } from 'react';
import apiClient from '../../api/apiClient';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import type { Event } from '../../types'; 

// Estrutura de dados que o gráfico Recharts vai consumir
interface ChartData {
 id: number;
 name: string;     // Nome para o eixo X (tema do evento)
 inscritos: number; // Valor para o eixo Y (altura da barra)
}

const Dashboard = () => {
 const [events, setEvents] = useState<Event[]>([]);
 const [loading, setLoading] = useState(true);

  // 1. Busca os dados da API quando o componente montar
  useEffect(() => {
    const fetchTopEvents = async () => {
      try {
        // Busca da rota que criamos no backend
        const response = await apiClient.get('/topEvents');
        setEvents(response.data);
      } catch (error) {
        console.error('Erro ao buscar top eventos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopEvents();
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  // 2. Prepara os dados para o gráfico (useMemo)
  // Esta é a parte principal da correção.
  const chartData: ChartData[] = useMemo(() => {
    return events.map(event => ({
      id: event.id,
      name: event.tema, // 'name' será usado no eixo X
      
      // ✅ CORREÇÃO: Usamos o 'inscritos_count' que veio da API
      // O '?? 0' garante que o valor seja 0 se 'inscritos_count'
      // for nulo ou indefinido.
      inscritos: event.inscritos_count ?? 0, 
    }));
  }, [events]); // Recalcula apenas quando 'events' mudar

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // 3. Renderização do gráfico e da lista
  return (
    <div style={{ padding: '20px', width: '100%' }}>
      <h1>📊 Dashboard - Eventos Populares</h1>
      
      <hr style={{ margin: '20px 0' }} />

      {/* Gráfico de barras */}
      <h2 style={{ marginBottom: '10px' }}>Gráfico de Inscrições</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart 
          data={chartData} // Nossos dados processados
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" /> 
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="inscritos" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
      
      <hr style={{ margin: '40px 0' }} />
      
      {/* Lista de eventos */}
      <div>
        <h2>Eventos e Contagem</h2>
        <ul>
          {chartData.length > 0 ? (
            chartData.map((dataItem) => (
                <li key={dataItem.id} style={{ margin: '5px 0' }}>
                  <strong>{dataItem.name}</strong> — {dataItem.inscritos} Inscrições
                </li>
            ))
          ) : (
            <p>Nenhum evento com inscrições encontrado.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;