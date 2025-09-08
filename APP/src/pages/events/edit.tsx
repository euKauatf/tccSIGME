// !!! Página de edição de eventos !!!

// IMPORTAÇÕES
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import apiClient from "../../api/apiClient"; // Mantenha o uso do apiClient para consistência
import type { Event } from "../../types";
import "./style.css";
import { IMaskInput } from 'react-imask';

// TIPOS
type EventFormData = Omit<Event, "id" | "created_at" | "updated_at">;

function EditEventPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const diasDaSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

  const [formData, setFormData] = useState<Partial<EventFormData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
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

  useEffect(() => {
    if (errorMessage) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [errorMessage]);

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
    e.preventDefault();
    setErrorMessage(null); // Limpa erros anteriores

    try {
      await apiClient.put(`/event/${eventId}`, formData);
      navigate("/events", {
        state: { message: "Evento editado com sucesso!" }
      });
    } catch (error) {
      let message = 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
      if (isAxiosError(error) && error.response) {
        const responseData = error.response.data;
        if (responseData.errors) {
          const firstErrorKey = Object.keys(responseData.errors)[0];
          message = responseData.errors[firstErrorKey][0];
        } else if (responseData.message) {
          message = responseData.message;
        }
      }
      setErrorMessage(message);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Carregando dados do evento...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex items-center justify-center w-full p-4">
      <div className="w-full max-w-2xl">
        {errorMessage && (
          <div role="alert" className="mb-4 alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 stroke-current shrink-0" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}
        <div className="flex flex-col divp rounded-[20px] p-6 sm:p-8 bg-emerald-50 shadow-lg min-h-[170px]">
          <h1 className="py-3 text-3xl font-bold text-center text-emerald-600">
            Editar Evento
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="tema" className="block text-sm font-medium text-gray-700">Tema do Evento</label>
              <input type="text" id="tema" name="tema" value={formData.tema || ''} onChange={handleChange} className="block w-full mt-1 input input-bordered" required />
            </div>
            <div>
              <label htmlFor="vagas_max" className="block text-sm font-medium text-gray-700">Quantidade de Vagas</label>
              <input type="number" id="vagas_max" name="vagas_max" value={formData.vagas_max || ''} onChange={handleChange} className="block w-full mt-1 input input-bordered" required />
            </div>
            <div>
              <label htmlFor="palestrante" className="block text-sm font-medium text-gray-700">Palestrante</label>
              <input type="text" id="palestrante" name="palestrante" value={formData.palestrante || ''} onChange={handleChange} className="block w-full mt-1 input input-bordered" required />
            </div>
            <div> {/* Editar email */}

              <label htmlFor="email_palestrante" className="block text-sm font-medium text-gray-700">Email</label>

              <input type="text" id="email_palestrante" disabled name="email_palestrante" value={formData.email_palestrante || ''} onChange={handleChange}

                className="block w-full mt-1 input input-bordered" required />

            </div>
            <div> {/* Editar telefone */}

              <label htmlFor="telefone_palestrante" className="block text-sm font-medium text-gray-700">Telefone do Palestrante</label>

              <IMaskInput mask="(00) 00000-0000" disabled id="telefone_palestrante" name="telefone_palestrante" value={formData.telefone_palestrante || ''} placeholder="(00) 00000-0000" className="w-full input input-bordered" required onAccept={(value) => { handleChange({ target: { name: 'telefone_palestrante', value: value, }, } as React.ChangeEvent<HTMLInputElement>); }} />

            </div>
            <div>
              <label htmlFor="local" className="block text-sm font-medium text-gray-700">Local</label>
              <input type="text" id="local" name="local" value={formData.local || ''} onChange={handleChange} className="block w-full mt-1 input input-bordered" required />
            </div>
            <div>
              <label htmlFor="horario_inicio" className="block text-sm font-medium text-gray-700">Horário de Início</label>
              <input type="time" id="horario_inicio" name="horario_inicio" value={formData.horario_inicio || ''} onChange={handleChange} className="block w-full mt-1 input input-bordered" required />
            </div>
            <div>
              <label htmlFor="horario_termino" className="block text-sm font-medium text-gray-700">Horário de Término</label>
              <input type="time" id="horario_termino" name="horario_termino" value={formData.horario_termino || ''} onChange={handleChange} className="block w-full mt-1 input input-bordered" required />
            </div>
            <div>
              <label htmlFor="data" className="block text-sm font-medium text-gray-700">Data do Evento</label>
              <select id="data" name="data" value={formData.data || ''} onChange={handleChange} className="block w-full mt-1 select select-bordered" required>
                <option value="" disabled>Selecione um dia</option>
                {diasDaSemana.map(dia => (
                  <option key={dia} value={dia}>{dia}-feira</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição</label>
              <textarea maxLength={400} id="descricao" name="descricao" value={formData.descricao || ''} onChange={handleChange} className="block w-full h-24 mt-1 textarea textarea-bordered" required />
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button type="button" onClick={() => navigate('/events')} className="btn btn-ghost">Cancelar</button>
              <button type="submit" className="btn btn-success">Salvar Alterações</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditEventPage;