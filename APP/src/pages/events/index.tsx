// !!! Aki é a página de eventos !!!

// IMPORTAÇÕES
import { useState, useEffect, useMemo } from "react"; // Importa o useState, useEffect, useMemo que são funções nativas do React
import { getEvents, getUser, deleteEvent, subscribeToEvent, verifyPassword, unsubscribeFromEvent, getSorteio, getSorteioClear } from "../../api/apiClient"; // Importa as funções do apiClient
import { isAxiosError } from "axios";
import type { Event, User } from "../../types"; // Importa os tipos de eventos e usuários
import "./style.css"; // Estilo 😎
import { useLocation } from "react-router-dom"; // Importa o useLocation pra poder pegar o flash do formulário
import { Link, useNavigate, useSearchParams } from "react-router-dom"; // Link, navegação e função pra pegar o parametro passado pelo link
import { useUser } from "../../hooks/useUser"; // Pra usar os dados do usuário

import PasswordModal from '../../components/modals/PasswordModal'; // Importa o componente PasswordModal
import EventModal from "../../components/modals/EventModal"; // Importa o componente EventModal
import InfoModal from '../../components/modals/InfoModal'; // Importa o componente InfoModal
import ConfirmModal from '../../components/modals/ConfirmModal'; // Importa o componente ConfirmModal

function EventsPage() {
  const { isAdmin } = useUser(); // Pega o usuário logado e verifica se é admin

  const [events, setEvents] = useState<Event[]>([]); // events é um estado que armazena os eventos
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null); // user é um estado que armazena o usuário logado

  const [selectedDay, setSelectedDay] = useState("Todos"); // selectedDay é um estado que armazena o dia selecionado
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true); // isLoading é um estado que indica se os dados estão sendo carregados
  const [error, setError] = useState<string | null>(null); // error é um estado que armazena o erro caso ocorra algum

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [infoModalContent, setInfoModalContent] = useState<InfoModalState>({ title: '', message: '', status: 'info' });

  const [confirmModalContent, setConfirmModalContent] = useState<ConfirmModalState>({
    isOpen: false,
    title: '',
    message: '',
    buttonType: 'btn-primary',
    onConfirm: () => { }, // Ação de confirmação vazia por padrão
  });

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

  type InfoModalState = {
    title: string;
    message: string;
    status: 'info' | 'success' | 'error';
  };

  type ConfirmModalState = {
    isOpen: boolean;
    title: string;
    message: string;
    buttonType: 'btn-primary' | 'btn-error' | 'btn-success';
    onConfirm: () => void; // A função a ser executada na confirmação
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

  const handleDelete = (eventId: number) => {
    const eventName = events.find(e => e.id === eventId)?.tema || 'este evento';
    setConfirmModalContent({
      isOpen: true,
      title: `Confirmar Exclusão`,
      message: `Você tem certeza que deseja excluir o evento "${eventName}"?`,
      buttonType: 'btn-error',
      onConfirm: () => handleConfirmDelete(eventId), // Passa a função com o ID
    });
  };


  const handleConfirmDelete = async (eventId: number) => {
    try {
      await deleteEvent(eventId);
      setEvents(prev => prev.filter(event => event.id !== eventId));

      setInfoModalContent({ title: 'Sucesso', message: 'O evento foi excluído com sucesso.', status: 'success' });
      setIsInfoModalOpen(true);

    } catch (err) {
      console.error('Erro ao excluir evento:', err);
      setInfoModalContent({ title: 'Erro', message: 'Não foi possível excluir o evento.', status: 'error' });
      setIsInfoModalOpen(true);
    } finally {
      setConfirmModalContent({ ...confirmModalContent, isOpen: false });
    }
  };

  const handleSubscription = (eventId: number) => {
    const eventName = events.find(e => e.id === eventId)?.tema || 'este evento';
    setConfirmModalContent({
      isOpen: true,
      title: 'Confirmar Inscrição',
      message: `Você deseja se inscrever no evento "${eventName}"?`,
      buttonType: 'btn-success',
      onConfirm: () => handleConfirmSubscription(eventId),
    });
  };

  const handleConfirmSubscription = async (eventId: number) => { // Garanta que ela recebe eventId
    try {
      await subscribeToEvent(eventId);

      // Atualiza o estado local do usuário para refletir a inscrição
      const subscribedEvent = events.find(e => e.id === eventId);
      if (subscribedEvent && user) {
        const newSubscribedEventWithPivot = {
          ...subscribedEvent,
          pivot: { status: 'inscrito' as const },
        };
        setUser({
          ...user,
          eventos: [...(user.eventos || []), newSubscribedEventWithPivot],
        });
      }

      // Feedback de sucesso
      setInfoModalContent({
        title: 'Inscrição Realizada!',
        message: 'Sua inscrição foi registrada com sucesso. Aguarde o sorteio.',
        status: 'success',
      });
      setIsInfoModalOpen(true);

    } catch (err) {
      console.error("Erro ao se inscrever no sorteio:", err);
      const errorMessage = isAxiosError(err) && err.response?.data?.message
        ? err.response.data.message
        : "Não foi possível realizar a inscrição. Talvez você já esteja inscrito ou o evento esteja lotado.";

      // Feedback de erro
      setInfoModalContent({
        title: 'Erro na Inscrição',
        message: errorMessage,
        status: 'error',
      });
      setIsInfoModalOpen(true);
    } finally {
      // Fecha o modal de confirmação
      setConfirmModalContent({ ...confirmModalContent, isOpen: false });
    }
  };

  const handleUnsubscribe = (eventId: number) => {
    const eventName = user?.eventos?.find(e => e.id === eventId)?.tema || 'este evento';

    setConfirmModalContent({
      isOpen: true,
      title: 'Cancelar Inscrição',
      message: `Tem certeza que deseja remover sua inscrição do evento "${eventName}"?`,
      buttonType: 'btn-error',
      // A mágica acontece aqui, conectando o ID à função de confirmação
      onConfirm: () => handleConfirmUnsubscribe(eventId),
    });
  };

  const handleConfirmUnsubscribe = async (eventId: number) => { // Garanta que ela recebe eventId
    try {
      await unsubscribeFromEvent(eventId);

      // Atualiza o estado local do usuário para refletir a remoção
      if (user) {
        setUser({
          ...user,
          eventos: user.eventos?.filter(e => e.id !== eventId) ?? [],
        });
      }

      // Feedback de sucesso com InfoModal
      setInfoModalContent({
        title: 'Inscrição Removida',
        message: 'Sua inscrição foi removida com sucesso.',
        status: 'success',
      });
      setIsInfoModalOpen(true);

    } catch (err) {
      console.error("Erro ao remover inscrição do sorteio:", err);

      // Feedback de erro com InfoModal
      setInfoModalContent({
        title: 'Erro',
        message: 'Não foi possível remover a sua inscrição.',
        status: 'error',
      });
      setIsInfoModalOpen(true);
    } finally {
      // Fecha o modal de confirmação
      setConfirmModalContent({ ...confirmModalContent, isOpen: false });
    }
  };

  const displayEvents = useMemo(() => { // displayEvents é um array com os eventos que serão exibidos na tela
    let sourceEvents: Event[] = []; // A lógica agora começa aqui

    if (filterMode === 'selecionados') {
      // Mostra apenas eventos onde o usuário foi 'selecionado'
      sourceEvents = user?.eventos?.filter(e => e.pivot?.status === 'contemplado') ?? [];
    } else if (filterMode === 'pendentes') {
      // Mostra apenas eventos onde o status ainda é 'inscrito' (aguardando sorteio)
      sourceEvents = user?.eventos?.filter(e => e.pivot?.status === 'inscrito') ?? [];
    } else { // 'todos'
      // Mostra todos os eventos do sistema
      sourceEvents = events;
    }

    // Aplica o filtro de dia da semana no resultado final

    if (selectedDay === "Todos") {
      return sourceEvents;
    }

    return sourceEvents.filter((event) => event.data === selectedDay);

  }, [events, user?.eventos, filterMode, selectedDay]);

  if (isLoading) {
    return <p className="p-8 text-center">Carregando eventos...</p>;
  }

  if (error) {
    return <p className="p-8 text-center text-red-500">{error}</p>;
  }

  const userSubscribedEventIds = new Set(user?.eventos?.map(e => e.pivot?.status === 'inscrito' ? e.id : null) ?? []); // Eventos que o usuário está inscrito
  const userSelectedEventIds = new Set(user?.eventos?.filter(e => e.pivot?.status === 'contemplado')?.map(e => e.id) ?? []);

  const handleSorteio = () => {
    setConfirmModalContent({
      isOpen: true,
      title: 'Realizar Sorteio Geral',
      message: 'Deseja realizar o sorteio geral agora? Esta ação selecionará os alunos para os eventos com vagas limitadas e não pode ser desfeita facilmente.',
      buttonType: 'btn-primary',
      onConfirm: handleConfirmSorteio,
    });
  };

  const handleConfirmSorteio = async () => {
    try { 
      const response = await getSorteio();
      setInfoModalContent({
        title: 'Sorteio Realizado!',
        message: 'O sorteio geral foi concluído com sucesso.',
        status: 'success'
      });
      setIsInfoModalOpen(true); // O reload da página acontece ao fechar este modal
      console.log(response.data);
    } catch (error) {
      console.error(error);
      const errorMessage = isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : "O sorteio não foi realizado devido a um erro.";
      setInfoModalContent({ title: 'Erro no Sorteio', message: errorMessage, status: 'error' });
      setIsInfoModalOpen(true);
    } finally {
      setConfirmModalContent({ ...confirmModalContent, isOpen: false });
    }
  };

  const handleSorteioClear = () => {
    setIsPasswordModalOpen(true); // A única responsabilidade agora é abrir o modal
  };

  const handleConfirmClearWithPassword = async (password: string) => {
    setIsPasswordModalOpen(false); // Fecha o modal imediatamente

    if (!password) {
      setInfoModalContent({ title: 'Atenção', message: 'A senha é obrigatória para esta ação.', status: 'error' });
      setIsInfoModalOpen(true);
      return;
    }

    try {
      await verifyPassword(password);

      const response = await getSorteioClear();
      setInfoModalContent({ title: 'Sucesso!', message: 'A limpeza dos dados do sorteio foi realizada com sucesso.', status: 'success' });
      setIsInfoModalOpen(true);
      console.log(response.data);

    } catch (error) {
      const errorMessage = isAxiosError(error) && error.response
        ? error.response.data.message
        : "Não foi possível concluir a operação devido a um erro inesperado.";

      setInfoModalContent({ title: 'Falha na Operação', message: errorMessage, status: 'error' });
      setIsInfoModalOpen(true);

      console.error(error);
    }
  };


  // PAGINA AKI AUAUAUAUUAUAUAUAU
  return (
    <div className="w-full min-h-screen p-4 font-sans main sm:p-6 lg:p-8"> { /* Parte princicpal da página */}

      {flashMessage && (
        <div role="alert" className="mb-4 alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 stroke-current shrink-0" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="font-semibold">{flashMessage}</span>
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
        <button
          key="todos-dias" // Chave única
          onClick={() => setSelectedDay("Todos")} // Define o state como "Todos"
          className={`px-4 py-2 divpEB rounded-lg font-semibold transition-colors ${selectedDay === "Todos" ? "bg-emerald-600 text-white shadow-lg" : "bg-white text-emerald-700 hover:bg-emerald-100"
            }`}
        >
          Todos os Dias
        </button>
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
            const isSelected = userSelectedEventIds.has(event.id);

            return (
              <div key={event.id} onClick={() => openModal(event)} className="flex flex-col justify-between p-6 shadow-lg bg-emerald-50 divpE rounded-2xl eventoD">

                <div>
                  <h2 className="text-2xl font-bold text-emerald-700">{event.tema}</h2>
                  <p className="mt-2 font-semibold text-gray-600">{event.horario_inicio}</p>
                  <p className="font-semibold text-gray-600">Local: {event.local}</p>
                  <p className="mt-4 text-gray-700 truncate">{event.descricao}</p>
                </div>

                <div className="mt-6">
                  {isAdmin ? (
                    <div className="flex justify-end gap-2">
                      <button onClick={(e) => { e.stopPropagation(); handleModify(event.id); }} className="btn btn-sm btn-success">Modificar</button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(event.id); }} className="btn btn-sm btn-error">Excluir</button>
                    </div>
                  ) : (
                    <div>
                      {isSubscribed ? (
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <button disabled className="flex-grow w-full py-2 font-bold text-white bg-gray-400 rounded-lg cursor-not-allowed sm:w-auto">
                            Pendente
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleUnsubscribe(event.id); }} className="flex-grow w-full py-2 font-bold text-white transition-all rounded-lg sm:w-auto bg-emerald-500 hover:bg-emerald-600">
                            Sair do sorteio
                          </button>
                        </div>
                      ) : (
                        <div>
                          {isSelected ? (
                            <div className="flex flex-col gap-2 sm:flex-row">
                              <button disabled className="flex-grow w-full py-2 font-bold text-white bg-gray-400 rounded-lg cursor-not-allowed sm:w-auto">
                                Contemplado
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); handleUnsubscribe(event.id); }} className="flex-grow w-full py-2 font-bold text-white transition-all rounded-lg sm:w-auto bg-emerald-500 hover:bg-emerald-600">
                                Sair do evento
                              </button>
                            </div>
                          ) : (
                            <div>
                              <button onClick={(e) => { e.stopPropagation(); handleSubscription(event.id); }} className="w-full py-2 font-bold text-white transition-all rounded-lg bg-emerald-500 hover:bg-emerald-600">
                                Participar
                              </button>
                            </div>
                          )}
                        </div>
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
            <Link to="/events/add" className="text-white bg-emerald-600 btn btn-lg">
              Adicionar Novo Evento
            </Link>
          </div>

          <div className="flex flex-row justify-center gap-4 my-14">
            <button onClick={handleSorteio} className="font-bold btn btn-sm btn-error">Sortear</button>
            <button onClick={handleSorteioClear} className="font-bold btn btn-sm btn-error">Limpar Sorteio</button>
          </div>
        </>
      )}
      <EventModal event={selectedEvent} onClose={closeModal} />
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onConfirm={handleConfirmClearWithPassword}
        title="Confirmar Limpeza do Sorteio"
        message="Esta ação é irreversível e irá apagar todos os alunos inscritos e selecionados da rodada atual. Para continuar, digite sua senha de administrador."
      />
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => {
          setIsInfoModalOpen(false);
        }}
        title={infoModalContent.title}
        message={infoModalContent.message}
        status={infoModalContent.status}
      />
      <ConfirmModal
        isOpen={confirmModalContent.isOpen}
        onClose={() => setConfirmModalContent({ ...confirmModalContent, isOpen: false })}
        onConfirm={confirmModalContent.onConfirm} // Simplesmente passa a função do estado
        title={confirmModalContent.title}
        message={confirmModalContent.message}
        confirmButtonText={confirmModalContent.buttonType === 'btn-error' ? "Excluir" : "Confirmar"}
        confirmButtonType={confirmModalContent.buttonType}
      />
    </div>
  );
}

export default EventsPage;