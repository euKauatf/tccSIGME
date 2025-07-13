import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";
import type { Event } from "../../types";
import "./style.css";
import { Link, useNavigate } from "react-router-dom";

interface User {
  id: number;
  name: string;
  tipo: string;
  eventos: Event[];
}

function EventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [selectedDay, setSelectedDay] = useState("Segunda");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.tipo === 'adm';
  const diasDaSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [eventsResponse, userResponse] = await Promise.all([
          apiClient.get("/event"),
          apiClient.get("/user"),
        ]);
        setEvents(eventsResponse.data);
        setUser(userResponse.data);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Não foi possível carregar os dados. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleModify = (eventId: number) => {
    navigate(`/events/edit/${eventId}`);
  };

  const handleDelete = async (eventId: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este evento?")) {
      return;
    }
    try {
      await apiClient.delete(`/event/${eventId}`);
      setEvents(prev => prev.filter(event => event.id !== eventId));
      alert('Evento excluído com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir evento:', err);
      alert('Não foi possível excluir o evento.');
    }
  };

  const handleSubscription = async (eventId: number) => {
    if (!window.confirm("Confirmar inscrição neste evento?")) {
      return;
    }
    try {
      await apiClient.post(`/events/${eventId}/subscribe`);
      alert("Inscrição realizada com sucesso!");

      const subscribedEvent = events.find(e => e.id === eventId);
      if (subscribedEvent && user) {
        setUser({
          ...user,
          eventos: [...user.eventos, subscribedEvent],
        });
      }
    } catch (err) {
      console.error("Erro ao se inscrever no evento:", err);
      alert("Não foi possível realizar a inscrição. Você talvez já esteja inscrito ou não há mais vagas.");
    }
  };

  if (isLoading) {
    return <p className="text-center p-8">Carregando eventos...</p>;
  }

  if (error) {
    return <p className="text-center p-8 text-red-500">{error}</p>;
  }

  const filteredEvents = events.filter((event) => event.data === selectedDay);
  const userSubscribedEventIds = new Set(user?.eventos?.map(e => e.id) ?? []);

  return (
    <div className="main font-sans w-full p-4">
      <h1 className="text-5xl font-bold text-center text-emerald-800 py-3">
        Programação da Expocanp
      </h1>

      <div className="flex justify-center gap-2 my-6">
        {diasDaSemana.map((dia) => (
          <button
            key={dia}
            onClick={() => setSelectedDay(dia)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${selectedDay === dia
              ? "bg-emerald-600 text-white shadow-lg"
              : "bg-white text-emerald-700 hover:bg-emerald-100"
              }`}
          >
            {dia}-feira
          </button>
        ))}
      </div>

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const isSubscribed = userSubscribedEventIds.has(event.id);
            return (
              <div key={event.id} className="bg-emerald-50 rounded-2xl shadow-lg p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-emerald-700">{event.tema}</h3>
                  <p className="font-semibold text-gray-600 mt-2">{event.horario_inicio}</p>
                  <p className="font-semibold text-gray-600">Local: {event.local}</p>
                  <p className="text-gray-700 mt-4">{event.descricao}</p>
                </div>

                <div className="mt-6">
                  {isAdmin ? (
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleModify(event.id)} className="btn btn-sm btn-info">Modificar</button>
                      <button onClick={() => handleDelete(event.id)} className="btn btn-sm btn-error">Excluir</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSubscription(event.id)}
                      disabled={isSubscribed}
                      className={`w-full py-2 rounded-lg text-white font-bold transition-all ${isSubscribed
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-emerald-500 hover:bg-emerald-600"
                        }`}
                    >
                      {isSubscribed ? "Inscrito" : "Inscrever-se"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center p-8 text-gray-500">Nenhum evento agendado para este dia.</p>
      )}

      {isAdmin && (
        <div className="flex justify-center mt-8">
          <Link to="/events/add" className="btn btn-lg btn-success text-white">
            Adicionar Novo Evento
          </Link>
        </div>
      )}
    </div>
  );
}

export default EventsPage;