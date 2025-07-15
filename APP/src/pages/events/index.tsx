// !!! Aki é a página de eventos !!!

// IMPORTAÇÕES
import { useState, useEffect } from "react";
// NOTA: Adicionada a importação de 'unsubscribeFromEvent'
import { getEvents, getUser, deleteEvent, subscribeToEvent, unsubscribeFromEvent } from "../../api/apiClient";
import type { Event, User } from "../../types";
import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";


function EventsPage() {
  const { isAdmin } = useUser(); // Pega o usuário logado e verifica se é admin
  
  // navigate é usado para navegar entre as páginas
  const navigate = useNavigate();
  // events é um estado que armazena os eventos
  const [events, setEvents] = useState<Event[]>([]);
  /// user é um estado que armazena o usuário logado
  const [user, setUser] = useState<User | null>(null);
  /// selectedDay é um estado que armazena o dia selecionado
  const [selectedDay, setSelectedDay] = useState("Segunda");
  // isLoading é um estado que indica se os dados estão sendo carregados
  const [isLoading, setIsLoading] = useState(true);
  // error é um estado que armazena o erro caso ocorra algum
  const [error, setError] = useState<string | null>(null);

  // diasDaSemana é um array com os dias da semana (se voce nao entende o que significa diasDaSemana, voce nao deveria estar aqui 💞)
  const diasDaSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

  // useEffect é usado para executar uma função quando o componente é montado
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [eventsResponse, userResponse] = await Promise.all([
          getEvents(), // Pega os eventos do backend
          getUser(), // Pega o usuário logado do backend
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

  // handleModify é uma função que é chamada quando o usuário clica no botão de editar
  const handleModify = (eventId: number) => {
    navigate(`/events/edit/${eventId}`);
  };

  // handleDelete é uma função que é chamada quando o usuário clica no botão de excluir
  const handleDelete = async (eventId: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este evento?")) {
      return;
    }
    try {
      await deleteEvent(eventId); // Chama a função deleteEvent do apiClient
      setEvents(prev => prev.filter(event => event.id !== eventId));
      alert('Evento excluído com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir evento:', err);
      alert('Não foi possível excluir o evento.');
    }
  };

  // handleSubscription é uma função que é chamada quando o usuário clica no botão de inscrever
  const handleSubscription = async (eventId: number) => {
    if (!window.confirm("Confirmar inscrição neste evento?")) {
      return;
    }
    try { // Verifica se o usuário já está inscrito no evento
      await subscribeToEvent(eventId); // Chama a função subscribeToEvent do apiClient
      alert("Inscrição realizada com sucesso!");

      const subscribedEvent = events.find(e => e.id === eventId);
      if (subscribedEvent && user) {
        setUser({
          ...user,
          events: [...(user.events || []), subscribedEvent],
        });
      }
    } catch (err) {
      console.error("Erro ao se inscrever no evento:", err);
      alert("Não foi possível realizar a inscrição. Você talvez já esteja inscrito ou não há mais vagas.");
    }
  };

  // NOVA FUNÇÃO: handleUnsubscribe é chamada ao clicar em "Remover Inscrição"
  const handleUnsubscribe = async (eventId: number) => {
    if (!window.confirm("Tem certeza que deseja remover sua inscrição deste evento?")) {
      return;
    }
    try {
      // Chame a função da API para cancelar a inscrição.
      // Lembre-se que ela deve fazer um DELETE para /api/eventos/{eventId}/cancelar
      await unsubscribeFromEvent(eventId);
      alert("Inscrição removida com sucesso!");

      // Atualiza o estado local do usuário para refletir a remoção
      if (user) {
        setUser({
          ...user,
          events: user.events?.filter(e => e.id !== eventId) ?? [],
        });
      }
    } catch (err) {
      console.error("Erro ao remover inscrição do evento:", err);
      alert("Não foi possível remover a inscrição.");
    }
  };

  // Se estiver carregando O (finge que é uma bolinha de carregando), exibe uma mensagem de carregamento
  if (isLoading) {
    return <p className="text-center p-8">Carregando eventos...</p>;
  }

  // Se ocorreu algum erro, exibe uma mensagem de erro
  if (error) {
    return <p className="text-center p-8 text-red-500">{error}</p>;
  }

  // Filtra os eventos com base no dia selecionado
  const filteredEvents = events.filter((event) => event.data === selectedDay);
  // Cria um conjunto com os IDs dos eventos inscritos pelo usuário
  const userSubscribedEventIds = new Set(user?.events?.map(e => e.id) ?? []);

  // PAGINA AKI AUAUAUAUUAUAUAUAU
  return (
    <div className="main font-sans w-full p-4"> { /* Parte princicpal da página */}
      <h1 className="text-5xl font-bold text-center text-emerald-800 py-3"> { /* Título da página */}
        Programação da Expocanp
      </h1>

      <div className="flex justify-center gap-2 my-6"> { /* Botões de seleção de dia */}
        {diasDaSemana.map((dia) => (
          <button key={dia} onClick={() => setSelectedDay(dia)} className={`px-4 py-2 rounded-lg font-semibold transition-colors ${selectedDay === dia ? "bg-emerald-600 text-white shadow-lg" : "bg-white text-emerald-700 hover:bg-emerald-100"}`}>
            {dia}-feira
          </button>
        ))}
      </div>

      { /* Mostra os eventos filtrados */}
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
                  ) : ( // LÓGICA DO BOTÃO ATUALIZADA AQUI
                    <div>
                      {isSubscribed ? (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            disabled
                            className="w-full py-2 rounded-lg text-white font-bold bg-gray-400 cursor-not-allowed"
                          >
                            Inscrito
                          </button>
                          <button
                            onClick={() => handleUnsubscribe(event.id)}
                            className="w-full py-2 rounded-lg text-white font-bold bg-emerald-500 hover:bg-emerald-600 transition-all"
                          >
                            Remover Inscrição
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSubscription(event.id)}
                          className="w-full py-2 rounded-lg text-white font-bold bg-emerald-500 hover:bg-emerald-600 transition-all"
                        >
                          Inscrever-se
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : ( // Se não há eventos para o dia selecionado, mostra uma mensagem
        <p className="text-center p-8 text-gray-500">Nenhum evento agendado para este dia.</p>
      )}

      {/* Botão de adicionar evento, só é mostrado para admins */}
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