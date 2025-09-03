// !!! Aki é a página de eventos !!!

// IMPORTAÇÕES
import { useState, useEffect, useMemo } from "react"; // Importa o useState, useEffect, useMemo que são funções nativas do React
import { getEvents, getUser, deleteEvent, subscribeToEvent, unsubscribeFromEvent, getSorteio, getSorteioClear } from "../../api/apiClient"; // Importa as funções do apiClient
import type { Event, User } from "../../types"; // Importa os tipos de eventos e usuários
import "./style.css"; // Estilo 😎
import { useLocation } from "react-router-dom"; // Importa o useLocation pra poder pegar o flash do formulário
import { Link, useNavigate, useSearchParams } from "react-router-dom"; // Link, navegação e função pra pegar o parametro passado pelo link
import { useUser } from "../../hooks/useUser"; // Pra usar os dados do usuário

import EventModal from "../../components/modals/EventModal"; // Importa o componente EventModal

function EventsPage() {
  const { isAdmin } = useUser(); // Pega o usuário logado e verifica se é admin

  const [events, setEvents] = useState<Event[]>([]); // events é um estado que armazena os eventos
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null); // user é um estado que armazena o usuário logado

  const [selectedDay, setSelectedDay] = useState("Segunda"); // selectedDay é um estado que armazena o dia selecionado
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true); // isLoading é um estado que indica se os dados estão sendo carregados
  const [error, setError] = useState<string | null>(null); // error é um estado que armazena o erro caso ocorra algum

  const navigate = useNavigate(); // navigate é usado para navegar entre as páginas
  const [searchParams] = useSearchParams(); // searchParams é pros parâmetros do link

  const getInitialFilterMode = () => { // Função que retorna o valor inicial do filtro
    const filter = searchParams.get('filter'); // Pega o filtro do link
    if (filter === 'pendentes' || filter === 'selecionados') {
      return filter;
    }
    return 'todos'; // Valor padrão
  };

  const openModal = (event: Event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  const [filterMode, setFilterMode] = useState(getInitialFilterMode);

  // diasDaSemana é um array com os dias da semana (se voce nao entende o que significa diasDaSemana, voce nao deveria estar aqui 💞)
  const diasDaSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

  // useEffect é usado para executar uma função quando o componente é montado
  useEffect(() => {
    if (location.state?.message) {
      setFlashMessage(location.state.message);
      // Limpa o state da localização para que a mensagem não reapareça se o usuário atualizar a página
      window.history.replaceState({}, document.title);
    }

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
  }, [location]);

  const handleModify = (eventId: number) => { // handleModify é pra editar
    navigate(`/events/edit/${eventId}`);
  };

  const handleDelete = async (eventId: number) => { // handleDelete é pra excluir
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

  // Em APP/srcs/pages/Events/index.tsx

  const handleSubscription = async (eventId: number) => {
    if (!window.confirm("Confirmar inscrição neste sorteio?")) {
      return;
    }
    try {
      await subscribeToEvent(eventId);
      alert("Inscrição realizada com sucesso!");

      const subscribedEvent = events.find(e => e.id === eventId);
      if (subscribedEvent && user) {
        // CORREÇÃO: Crie um novo objeto de evento com a propriedade 'pivot'
        const newSubscribedEventWithPivot = {
          ...subscribedEvent,
          pivot: {
            status: 'inscrito' as const // Adiciona o status 'inscrito'
          }
        };

        // Atualize o estado do usuário com o evento formatado corretamente
        setUser({
          ...user,
          eventos: [...(user.eventos || []), newSubscribedEventWithPivot],
        });
      }
    } catch (err) {
      console.error("Erro ao se inscrever no sorteio:", err);
      alert("Não foi possível realizar a inscrição pro sorteio. Talvez você já esteja inscrito!");
    }
  };

  const handleUnsubscribe = async (eventId: number) => { // handleUnsubscribe é pra cancelar a inscrição do sorteio
    if (!window.confirm("Tem certeza que deseja remover sua inscrição deste evento?")) {
      return;
    }
    try {
      await unsubscribeFromEvent(eventId);
      alert("Inscrição removida com sucesso!");

      if (user) { // Atualiza o estado local do usuário para refletir a remoção
        setUser({
          ...user,
          eventos: user.eventos?.filter(e => e.id !== eventId) ?? [],
        });
      }
    } catch (err) {
      console.error("Erro ao remover inscrição do sorteio:", err);
      alert("Não foi possível remover a inscrição.");
    }
  };

  const displayEvents = useMemo(() => { // displayEvents é um array com os eventos que serão exibidos na tela
    let sourceEvents: Event[] = []; // A lógica agora começa aqui

    if (filterMode === 'selecionados') {
      // Mostra apenas eventos onde o usuário foi 'selecionado'
      sourceEvents = user?.eventos?.filter(e => e.pivot?.status === 'selecionado') ?? [];
    } else if (filterMode === 'pendentes') {
      // Mostra apenas eventos onde o status ainda é 'inscrito' (aguardando sorteio)
      sourceEvents = user?.eventos?.filter(e => e.pivot?.status === 'inscrito') ?? [];
    } else { // 'todos'
      // Mostra todos os eventos do sistema
      sourceEvents = events;
    }

    // Aplica o filtro de dia da semana no resultado final
    return sourceEvents.filter((event) => event.data === selectedDay);

  }, [events, user?.eventos, filterMode, selectedDay]);

  if (isLoading) {
    return <p className="p-8 text-center">Carregando eventos...</p>;
  }

  if (error) {
    return <p className="p-8 text-center text-red-500">{error}</p>;
  }

  const userSubscribedEventIds = new Set(user?.eventos?.map(e => e.id) ?? []); // Eventos que o usuário está inscrito

  const handleSorteio = async () => {//função que vai chamar a api do sorteio de alunos
    if (!window.confirm("Deseja realizar o sorteio geral agora?")) return;
    try {
      const response = await getSorteio();
      alert("Sorteio realizado!");
      console.log(response.data);
    }
    catch (error) {
      alert("O sorteio não foi realizado");
      console.error(error);
    }
  };
  const handleSorteioClear = async () => {//função que vai chamar a api do sorteio de alunos
    if (!window.confirm("Deseja realizar a limpeza do sorteio?")) return;
    try {
      const response = await getSorteioClear();
      alert("Limpeza realizada!");
      console.log(response.data);
    }
    catch (error) {
      alert("A limpeza não foi realizada");
      console.error(error);
    }
  };


  // PAGINA AKI AUAUAUAUUAUAUAUAU
  return (
    <div className="w-full min-h-screen p-4 font-sans main sm:p-6 lg:p-8"> { /* Parte princicpal da página */}

      {flashMessage && (
        <div role="alert" className="mb-4 alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 stroke-current shrink-0" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{flashMessage}</span>
        </div>
      )}

      <h1 className="py-3 text-5xl font-bold text-center md:text-5xl text-emerald-800"> { /* Título da página */}
        Programação da Expocanp
      </h1>

      {isAdmin ? null : (
        <div className="flex flex-wrap justify-center w-full gap-2 my-6"> { /* Botões de filtro de eventos inscrições e tal */}
          <button onClick={() => setFilterMode('todos')} className={`px-4 py-2 rounded-lg divpEB font-semibold transition-colors shadow-lg ${filterMode === 'todos' ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-700 hover:bg-emerald-100'}`}>
            Todos
          </button>
          <button onClick={() => setFilterMode('pendentes')} className={`px-4 py-2 rounded-lg divpEB font-semibold transition-colors shadow-lg ${filterMode === 'pendentes' ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-700 hover:bg-emerald-100'}`}>
            Pendentes
          </button>
          <button onClick={() => setFilterMode('selecionados')} className={`px-4 py-2 rounded-lg divpEB font-semibold transition-colors shadow-lg ${filterMode === 'selecionados' ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-700 hover:bg-emerald-100'}`}>
            Selecionados
          </button>
        </div>
      )}

      <div className="flex flex-wrap justify-center w-full gap-2 my-6"> { /* Botões de seleção de dia */}
        {diasDaSemana.map((dia) => (
          <button key={dia} onClick={() => setSelectedDay(dia)} className={`px-4 py-2 divpEB rounded-lg font-semibold transition-colors ${selectedDay === dia ? "bg-emerald-600 text-white shadow-lg" : "bg-white text-emerald-700 hover:bg-emerald-100"}`}>
            {dia}-feira
          </button>
        ))}
      </div>

      { /* Mostra os eventos filtrados */}
      {displayEvents.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayEvents.map((event) => {
            const isSubscribed = userSubscribedEventIds.has(event.id);

            return (
              <div key={event.id} onClick={() => openModal(event)} className="flex flex-col justify-between p-6 shadow-lg bg-emerald-50 divpE rounded-2xl eventoD">

                <div>
                  <h2 className="text-2xl font-bold text-emerald-700">{event.tema}</h2>
                  <p className="mt-2 font-semibold text-gray-600">{event.horario_inicio}</p>
                  <p className="font-semibold text-gray-600">Local: {event.local}</p>
                  <p className="mt-4 text-gray-700 line-clamp-3">{event.descricao}</p>
                </div>

                <div className="mt-6">
                  {isAdmin ? (
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleModify(event.id)} className="btn btn-sm btn-info">Modificar</button>
                      <button onClick={() => handleDelete(event.id)} className="btn btn-sm btn-error">Excluir</button>
                    </div>
                  ) : (
                    <div>
                      {isSubscribed ? (
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <button disabled className="flex-grow w-full py-2 font-bold text-white bg-gray-400 rounded-lg cursor-not-allowed sm:w-auto">
                            Pendente
                          </button>
                          <button onClick={() => handleUnsubscribe(event.id)} className="flex-grow w-full py-2 font-bold text-white transition-all rounded-lg sm:w-auto bg-emerald-500 hover:bg-emerald-600">
                            Sair do sorteio
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => handleSubscription(event.id)} className="w-full py-2 font-bold text-white transition-all rounded-lg bg-emerald-500 hover:bg-emerald-600">
                          Participar
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="p-8 text-center text-gray-500">Nenhum evento agendado para este dia.</p>
      )}

      {/* Botão de adicionar evento e de fazer o sorteio geral, só é mostrado para admins */}
      {isAdmin && (
        <>
          <div className="flex justify-center mt-8">
            <Link to="/events/add" className="text-white btn btn-lg btn-success">
              Adicionar Novo Evento
            </Link>
          </div>

          <div className="flex flex-row justify-center gap-4 my-14">
            <button onClick={handleSorteio} className="text-white btn btn-sm btn-warning">Sortear</button>
            <button onClick={handleSorteioClear} className="text-white btn btn-sm btn-warning">Limpar Sorteio</button>
          </div>
        </>
      )}
      <EventModal event={selectedEvent} onClose={closeModal} />
    </div>
  );
}

export default EventsPage;