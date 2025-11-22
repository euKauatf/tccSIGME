import { useState, useEffect, useMemo } from "react";
import apiClient from "../../api/apiClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Event } from "../../types";

interface ChartData {
  id: number;
  name: string;
  inscritos: number;
}

const Dashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopEvents = async () => {
      try {
        const response = await apiClient.get("/topEvents");
        setEvents(response.data);
      } catch (error) {
        console.error("Erro ao buscar top eventos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopEvents();
  }, []);
  const chartData: ChartData[] = useMemo(() => {
    return events.map((event) => ({
      id: event.id,
      name: event.tema,
      inscritos: event.inscritos_count ?? 0,
    }));
  }, [events]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <span className="loading loading-spinner loading-lg"></span>{" "}
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", width: "100%" }}>
      <h2 style={{ marginBottom: "10px" }}>Gráfico de Inscrições</h2>{" "}
      <ResponsiveContainer width="100%" height={400}>
        {" "}
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="inscritos" fill="#8884d8" />{" "}
        </BarChart>{" "}
      </ResponsiveContainer>
      <div>
        <h2>Eventos e Contagem</h2>{" "}
        <ul>
          {" "}
          {chartData.length > 0 ? (
            chartData.map((dataItem) => (
              <li key={dataItem.id} style={{ margin: "5px 0" }}>
                <strong>{dataItem.name}</strong> — {dataItem.inscritos}{" "}
                Inscrições{" "}
              </li>
            ))
          ) : (
            <p>Nenhum evento com inscrições encontrado.</p>
          )}{" "}
        </ul>{" "}
      </div>{" "}
    </div>
  );
};

export default Dashboard;
