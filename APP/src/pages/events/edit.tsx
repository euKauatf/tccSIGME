import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";
import type { Event } from "../../types";
import "./style.css";

type EventFormData = Omit<Event, "id" | "created_at" | "updated_at">;

function EditEventPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const diasDaSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

  const [formData, setFormData] = useState<Partial<EventFormData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;

    const fetchEventData = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(`/event/${eventId}`);
        setFormData(response.data);
      } catch (err) {
        console.error("Erro ao buscar dados do evento:", err);
        setError("Não foi possível encontrar o evento para edição.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventData();
  }, [eventId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Previne o recarregamento da página

    if (!window.confirm("Confirmar as alterações no evento?")) {
      return;
    }

    try {
      await apiClient.put(`/event/${eventId}`, formData);
      alert("Evento atualizado com sucesso!");
      navigate("/events"); // Redireciona de volta para a lista de eventos
    } catch (err) {
      console.error("Erro ao atualizar o evento:", err);
      alert("Falha ao atualizar o evento. Verifique os dados e tente novamente.");
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Carregando dados do evento...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col glass rounded-[20px] p-6 sm:p-8 bg-emerald-50 shadow-lg min-h-[170px]">
          <h1 className="text-3xl font-bold text-center text-emerald-600 py-3">
            Editar Evento
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div>
              <label htmlFor="tema" className="block text-sm font-medium text-gray-700">Tema do Evento</label>
              <input type="text" id="tema" name="tema" value={formData.tema || ''} onChange={handleChange} className="mt-1 block w-full input input-bordered" required />
            </div>

            <div>
              <label htmlFor="vagas_max" className="block text-sm font-medium text-gray-700">Quantidade de Vagas</label>
              <input type="number" id="vagas_max" name="vagas_max" value={formData.vagas_max || ''} onChange={handleChange}
                className="mt-1 block w-full input input-bordered" required />
            </div>

            <div>
              <label htmlFor="palestrante" className="block text-sm font-medium text-gray-700">Palestrante</label>
              <input type="text" id="palestrante" name="palestrante" value={formData.palestrante || ''} onChange={handleChange}
                className="mt-1 block w-full input input-bordered" required />
            </div>

            <div>
              <label htmlFor="local" className="block text-sm font-medium text-gray-700">Local</label>
              <input type="text" id="local" name="local" value={formData.local || ''} onChange={handleChange}
                className="mt-1 block w-full input input-bordered" required />
            </div>

            <div>
              <label htmlFor="horario_inicio" className="block text-sm font-medium text-gray-700">Horário de Início</label>
              <input type="text" id="horario_inicio" name="horario_inicio" value={formData.horario_inicio || ''} onChange={handleChange}
                className="mt-1 block w-full input input-bordered" required />
            </div>

            <div>
              <label htmlFor="horario_termino" className="block text-sm font-medium text-gray-700">Horário de Término</label>
              <input type="text" id="horario_termino" name="horario_termino" value={formData.horario_termino || ''} onChange={handleChange}
                className="mt-1 block w-full input input-bordered" required />
            </div>

            <div>
              <label htmlFor="data" className="block text-sm font-medium text-gray-700">Data do Evento</label>
              <select id="data" name="data" value={formData.data || ''} onChange={handleChange} className="mt-1 block w-full select select-bordered" required>
                <option value="" disabled>Selecione um dia</option>
                {diasDaSemana.map(dia => (
                  <option key={dia} value={dia}>{dia}-feira</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição</label>
              <textarea id="descricao" name="descricao" value={formData.descricao || ''} onChange={handleChange}
                className="mt-1 block w-full textarea textarea-bordered h-24" required />
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button type="button" onClick={() => navigate('/events')}
                className="btn btn-ghost" > Cancelar </button>
              <button type="submit" className="btn btn-success"> Salvar Alterações </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditEventPage;