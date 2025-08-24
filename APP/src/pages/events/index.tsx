// !!! Aki é a página de eventos !!!

// IMPORTAÇÕES
import { useState, useEffect, useMemo } from "react"; // Importa o useState, useEffect, useMemo que são funções nativas do React
import { getEvents, getUser, deleteEvent, subscribeToEvent, unsubscribeFromEvent, getSorteio, getSorteioClear } from "../../api/apiClient"; // Importa as funções do apiClient
import type { Event, User } from "../../types"; // Importa os tipos de eventos e usuários
import "./style.css"; // Estilo 😎
import { Link, useNavigate, useSearchParams } from "react-router-dom"; // Link, navegação e função pra pegar o parametro passado pelo link
import { useUser } from "../../hooks/useUser"; // Pra usar os dados do usuário

function EventsPage() {
  const { isAdmin } = useUser(); // Pega o usuário logado e verifica se é admin

  const [events, setEvents] = useState<Event[]>([]); // events é um estado que armazena os eventos
  const [user, setUser] = useState<User | null>(null); // user é um estado que armazena o usuário logado

  const [selectedDay, setSelectedDay] = useState("Segunda"); // selectedDay é um estado que armazena o dia selecionado
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

  const [filterMode, setFilterMode] = useState(getInitialFilterMode);

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
    return <p className="text-center p-8">Carregando eventos...</p>;
  }

  if (error) {
    return <p className="text-center p-8 text-red-500">{error}</p>;
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
    <div className="main font-sans w-full min-h-screen p-4 sm:p-6 lg:p-8"> { /* Parte princicpal da página */}
      <h1 className="text-5xl md:text-5xl font-bold text-center text-emerald-800 py-3"> { /* Título da página */}
        Programação da Expocanp
      </h1>

      {isAdmin ? null : (
        <div className="flex flex-wrap justify-center gap-2 my-6 w-full"> { /* Botões de filtro de eventos inscrições e tal */}
          <button onClick={() => setFilterMode('todos')} className={`px-4 py-2 rounded-lg font-semibold transition-colors shadow-lg ${filterMode === 'todos' ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-700 hover:bg-emerald-100'}`}>
            Todos
          </button>
          <button onClick={() => setFilterMode('pendentes')} className={`px-4 py-2 rounded-lg font-semibold transition-colors shadow-lg ${filterMode === 'pendentes' ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-700 hover:bg-emerald-100'}`}>
            Pendentes
          </button>
          <button onClick={() => setFilterMode('selecionados')} className={`px-4 py-2 rounded-lg font-semibold transition-colors shadow-lg ${filterMode === 'selecionados' ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-700 hover:bg-emerald-100'}`}>
            Selecionados
          </button>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-2 my-6 w-full"> { /* Botões de seleção de dia */}
        {diasDaSemana.map((dia) => (
          <button key={dia} onClick={() => setSelectedDay(dia)} className={`px-4 py-2 rounded-lg font-semibold transition-colors ${selectedDay === dia ? "bg-emerald-600 text-white shadow-lg" : "bg-white text-emerald-700 hover:bg-emerald-100"}`}>
            {dia}-feira
          </button>
        ))}
      </div>

      { /* Mostra os eventos filtrados */}
      {displayEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayEvents.map((event) => {
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
                    <div>
                      {isSubscribed ? (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button disabled className="w-full sm:w-auto flex-grow py-2 rounded-lg text-white font-bold bg-gray-400 cursor-not-allowed">
                            Pendente
                          </button>
                          <button onClick={() => handleUnsubscribe(event.id)} className="w-full sm:w-auto flex-grow py-2 rounded-lg text-white font-bold bg-emerald-500 hover:bg-emerald-600 transition-all">
                            Sair do sorteio
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => handleSubscription(event.id)} className="w-full py-2 rounded-lg text-white font-bold bg-emerald-500 hover:bg-emerald-600 transition-all">
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
        <p className="text-center p-8 text-gray-500">Nenhum evento agendado para este dia.</p>
      )}

      {/* Botão de adicionar evento e de fazer o sorteio geral, só é mostrado para admins */}
      {isAdmin && (
        <>
          <div className="flex justify-center mt-8">
            <Link to="/events/add" className="btn btn-lg btn-success text-white">
              Adicionar Novo Evento
            </Link>
          </div>

          <div className="flex flex-row justify-center gap-4 my-14">
            <button onClick={handleSorteio} className="btn btn-sm btn-warning text-white">Sortear</button>
            <button onClick={handleSorteioClear} className="btn btn-sm btn-warning text-white">Limpar Sorteio</button>
          </div>
        </>
      )}
    </div>
  );
}

export default EventsPage;