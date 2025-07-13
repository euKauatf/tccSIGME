import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function FormEvent() {
  const [formData, setFormData] = useState({
    tema: "",
    vagas_max: "",
    palestrante: "",
    local: "",
    data: "",
    horario_inicio: "",
    horario_termino: "",
    descricao: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const eventData = {
      ...formData,
      vagas_max: Number(formData.vagas_max),
    };

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

  return (
    <div className="w-full flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col glass rounded-[20px] p-6 sm:p-8 bg-emerald-50 shadow-lg min-h-[170px]">
          <h1 className="text-3xl font-bold text-center text-emerald-600 py-3">
            Criar Evento
          </h1>


          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="tema" className="block text-sm font-medium text-gray-700">Tema do Evento</label>
              <input name="tema" value={formData.tema} onChange={handleChange} type="text" placeholder="Tema do Evento" className="input input-bordered w-full" required />
            </div>
            <div>
              <label htmlFor="vagas_max" className="block text-sm font-medium text-gray-700">Quantidade de Vagas</label>
              <input name="vagas_max" value={formData.vagas_max} onChange={handleChange} type="number" placeholder="Quantidade de Vagas" className="input input-bordered w-full" required />
            </div>
            <div>
              <label htmlFor="palestrante" className="block text-sm font-medium text-gray-700">Palestrante</label>
              <input name="palestrante" value={formData.palestrante} onChange={handleChange} type="text" placeholder="Palestrante" className="input input-bordered w-full" required />
            </div>
            <div>
              <label htmlFor="local" className="block text-sm font-medium text-gray-700">Local</label>
              <input name="local" value={formData.local} onChange={handleChange} type="text" placeholder="Local" className="input input-bordered w-full" required />
            </div>
            <div>
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
            <div>
              <label htmlFor="horario_inicio" className="block text-sm font-medium text-gray-700">Horário</label>
              <input name="horario_inicio" value={formData.horario_inicio} onChange={handleChange} placeholder="00:00" type="text" className="input input-bordered w-full" required />
            </div>
            <div>
              <label htmlFor="horario_termino" className="block text-sm font-medium text-gray-700">Horário de Término</label>
              <input
                id="horario_termino"
                name="horario_termino"
                value={formData.horario_termino}
                onChange={handleChange}
                type="time"
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição</label>
              <textarea name="descricao" id="descricao" value={formData.descricao} onChange={handleChange} placeholder="Descrição" className="textarea textarea-bordered w-full" required />
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button type="button" onClick={() => navigate("/events")}
                className="btn btn-ghost" > Cancelar </button>
              <button type="submit" className="btn btn-success text-white">
                Criar Evento
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FormEvent;
