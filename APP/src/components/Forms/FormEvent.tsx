// !!! Formulário para criar um evento novo !!!

// IMPORTAÇÕES
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IMaskInput } from 'react-imask';

function FormEvent() {
  const [formData, setFormData] = useState({ // Pra salvar as paradinha tudo do formulário pra um evento novo
    tema: "",
    vagas_max: "",
    palestrante: "",
    email_palestrante: "",
    telefone_palestrante: "",
    local: "",
    data: "",
    horario_inicio: "",
    horario_termino: "",
    descricao: "",
  });

  const navigate = useNavigate(); // Importa o useNavigate para redirecionar para a página de eventos

  // Pega os dados do formulário e salva no estado
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Envia os dados pra API
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const eventData = {
      ...formData,
      vagas_max: Number(formData.vagas_max),
    };

    if (eventData.horario_inicio > eventData.horario_termino) {
      alert("O horário de inicio deve ser menor que o horário de termino.");
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/event", eventData);
      alert("Evento criado com sucesso!");
      navigate("/events");
    } catch (error) {
      if (error instanceof Error) {
        console.error('Ocorreu um erro:', error.message);
      } else {
        console.error('Um erro inesperado ocorreu:', error);
      }
    }
  };

  // RENDERIZAÇÃO DO SITE
  return (
    <div className="w-full flex items-center justify-center p-4"> {/* Div principal que centraliza o formulário */}
      <div className="w-full max-w-2xl"> {/* Div que contém o formulário */}
        {/* Cardzinho bonitinho pei pei pei aqui abaixo */}
        <div className="flex flex-col glass rounded-[20px] p-6 sm:p-8 bg-emerald-50 shadow-lg min-h-[170px]">

          <h1 className="text-3xl font-bold text-center text-emerald-600 py-3">
            Criar Evento
          </h1>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div> {/* Tema do evento */}
              <label htmlFor="tema" className="block text-sm font-medium text-gray-700">Tema do Evento</label>
              <input name="tema" value={formData.tema} onChange={handleChange} type="text" placeholder="Tema do Evento" className="input input-bordered w-full" required />
            </div>

            <div> {/* Vagas máximas */}
              <label htmlFor="vagas_max" className="block text-sm font-medium text-gray-700">Quantidade de Vagas</label>
              <input name="vagas_max" value={formData.vagas_max} onChange={handleChange} type="number" placeholder="Quantidade de Vagas" className="input input-bordered w-full" required />
            </div>

            <div> {/* Palestrante do evento */}
              <label htmlFor="palestrante" className="block text-sm font-medium text-gray-700">Palestrante</label>
              <input name="palestrante" value={formData.palestrante} onChange={handleChange} type="text" placeholder="Palestrante" className="input input-bordered w-full" required />
            </div>

            <div> {/* Email do palestrante */}
              <label htmlFor="email_palestrante" className="block text-sm font-medium text-gray-700">Email do Palestrante</label>
              <input name="email_palestrante" value={formData.email_palestrante} onChange={handleChange} type="text" placeholder="Email" className="input input-bordered w-full" required />
            </div>

            <div> {/* Telefone do palestrante */}
              <label htmlFor="telefone_palestrante" className="block text-sm font-medium text-gray-700">Telefone do Palestrante</label>
              <IMaskInput mask="(00) 00000-0000" name="telefone_palestrante" value={formData.telefone_palestrante} placeholder="(00) 00000-0000" className="input input-bordered w-full" required onAccept={(value) => { setFormData(prevState => ({ ...prevState, telefone_palestrante: value as string, })); }} />
            </div>

            <div> {/* Local do evento */}
              <label htmlFor="local" className="block text-sm font-medium text-gray-700">Local</label>
              <input name="local" value={formData.local} onChange={handleChange} type="text" placeholder="Local" className="input input-bordered w-full" required />
            </div>

            <div> {/* Dia do evento */}
              <label htmlFor="data" className="block text-sm font-medium text-gray-700">Data</label>
              <select id="data" name="data" value={formData.data} onChange={handleChange} className="select select-bordered w-full mt-1" required>
                <option value="" disabled>Selecione um dia</option>
                <option value="Segunda">Segunda-feira</option>
                <option value="Terça">Terça-feira</option>
                <option value="Quarta">Quarta-feira</option>
                <option value="Quinta">Quinta-feira</option>
                <option value="Sexta">Sexta-feira</option>
              </select>
            </div>

            <div> {/* Horário de início */}
              <label htmlFor="horario_inicio" className="block text-sm font-medium text-gray-700">Horário</label>
              <input name="horario_inicio" value={formData.horario_inicio} onChange={handleChange} placeholder="00:00" type="time" className="input input-bordered w-full" required />
            </div>

            <div> {/* Horário de término (Preciso mudar o tipo do input) */}
              <label htmlFor="horario_termino" className="block text-sm font-medium text-gray-700">Horário de Término</label>
              <input id="horario_termino" name="horario_termino" value={formData.horario_termino} onChange={handleChange} type="time" className="input input-bordered w-full" required />
            </div>

            <div> {/* Descrição do evento */}
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição</label>
              <textarea name="descricao" id="descricao" value={formData.descricao} onChange={handleChange} placeholder="Descrição" className="textarea textarea-bordered w-full" required />
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-4 mt-6">
              <button type="button" onClick={() => navigate("/events")} className="btn btn-ghost" > Cancelar </button>
              <button type="submit" className="btn btn-success text-white"> Criar Evento </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default FormEvent;
