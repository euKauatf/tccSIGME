// import { useUser } from "../../hooks/useUser"; // Importa o hook que criamos no MainLayout
import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";
import type { Event } from "../../types";
import "./style.css";
import { deleteEvent } from "../../api/apiClient";
import { Link } from "react-router-dom";

function EventsPage() {
    //const { user } = useUser();
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError ] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setIsLoading(true);
                const response = await apiClient.get("/event");
                setEvents(response.data);
            } catch (err) {
                console.error("Erro ao buscar eventos:", err);
                setError("Não foi possível carregar os eventos.");
            } finally {
                setIsLoading(false);
            }
        }

        fetchEvents();
    }, []);

    const handleModify = (eventId: number) => {
        console.log(`Modificar evento com ID: ${eventId}`);
        // Aqui viria a lógica para navegar para uma página de edição, por exemplo:
        // navigate(`/events/edit/${eventId}`);
      };
    
    const handleDelete = async (eventId: number) => {
            try {
                await deleteEvent(eventId);
                // Atualiza a lista na tela removendo o evento excluído
                setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
                alert('Evento excluído com sucesso!');
            } catch (err) {
                console.error('Erro ao excluir evento:', err);
                alert('Não foi possível excluir o evento.');
            }
    };


    const renderEventList = () => { 
        if (isLoading) {
            return <p className="text-center p-8">Carregando eventos</p>
        }

        if (error) {
            return <p className="text-center p-8 text-red-500">{error}</p>
        }

        if (events.length === 0) {
            return <p className="text-center p-8">Nenhum evento registrado no momento.</p>
        }

        return (
            <ul className="flex flex-col gap-y-2 pb-6">
                {events.map((event) => (
                    <li key={event.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <span className="font-bold text-gray-800">{event.tema}</span>
                        <div className="flex gap-x-2">
                            <button onClick={() => handleModify(event.id)} className="btn btn-sm btn-warning">Modificar</button>
                            <button onClick={() => handleDelete(event.id)} className="btn btn-sm btn-error">Excluir</button>
                        </div>
                    </li>
                ))}
            </ul>
        )
    }

    return (
        // -=-=-=-=-=-=-=-=-=-=-=- Divisão principal do site -=-=-=-=-=-=-=-=-=--=-=-=-=-=-
        <div className="main font-sans flex flex-col items-center justify-center">
            {/* -=-=-=-=-=-=-=-=-=-=-=- Texto do topo do site -=-=-=-=-=-=-=-=-=-=-=- */}
            <h1 className="text-5xl font-bold text-center text-emerald-800 py-3">
                Eventos Registrados
            </h1>
            {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */}

            {/* -=-=-=-=-=-=-=-=-=-=-=- Div para a lista de eventos -=-=-=-=-=-=-=-=-=--=-=-=-=-=- */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col glass rounded-[20px] min-h-[170px] mb-30 px-6 bg-emerald-50">
                    {/* -=-=-=-=-=-=-=-=-=-=-=- Titulo da div -=-=-=-=-=-=-=-=-=-=-=- */}
                    <h2 className="text-[36px] text-emerald-600 py-3 text-center">
                        Lista de Eventos
                    </h2>
                    {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */}

                    {/* -=-=-=-=-=-=-=-=-=-=-=- Lista de eventos -=-=-=-=-=-=-=-=-=--=-=-=-=-=- */}
                    {renderEventList()}

                    <Link to="/events/add" className="btn btn-active btn-info mb-6 text-center">
                        Adicionar Evento
                    </Link>
                    {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */}
                </div>
                {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */}
            </div>
            {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */}
        </div>
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    );
}

export default EventsPage;