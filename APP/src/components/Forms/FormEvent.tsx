import { useState } from "react";
import axios from "axios";

function FormEvent() {
  const [formData, setFormData] = useState({
    tema: "",
    vagas_max: "",
    palestrante: "",
    local: "",
    descricao: "",
  });

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date || !time) {
      alert("Por favor, preencha a data e a hora do evento.");
      return;
    }

    const horario_inicio = `${date}T${time}`;

    const eventData = {
      ...formData,
      vagas_max: Number(formData.vagas_max),
      horario_inicio: horario_inicio,
      horario_termino: horario_inicio, 
    };

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/event", eventData);
      
      console.log("Evento criado com sucesso:", response.data);
      alert("Evento criado com sucesso!");
      
      setFormData({ tema: "", vagas_max: "", palestrante: "", local: "", descricao: "" });
      setDate("");
      setTime("");

    } catch (error) {
      console.error("Erro ao criar evento:", error.response?.data || error.message);
      alert("Ocorreu um erro ao criar o evento. Verifique o console.");
    }
  };

  return (
    <div className="main font-sans flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-emerald-800 my-6">Criar Evento</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        <input name="tema" value={formData.tema} onChange={handleChange} type="text" placeholder="Tema do Evento" className="input input-bordered w-full" required />
        <input name="vagas_max" value={formData.vagas_max} onChange={handleChange} type="number" placeholder="Quantidade de Vagas" className="input input-bordered w-full" required />
        <input name="palestrante" value={formData.palestrante} onChange={handleChange} type="text" placeholder="Palestrante" className="input input-bordered w-full" required />
        <input name="local" value={formData.local} onChange={handleChange} type="text" placeholder="Local" className="input input-bordered w-full" required />
        
        <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="input input-bordered w-full" required />
        {/* CORRIGIDO: Removido o segundo input de hora que estava duplicado */}
        <input value={time} onChange={(e) => setTime(e.target.value)} type="time" className="input input-bordered w-full" required />
        
        <textarea name="descricao" value={formData.descricao} onChange={handleChange} placeholder="Descrição" className="textarea textarea-bordered w-full" required />

        <button type="submit" className="btn btn-success text-white">
          Criar Evento
        </button>
      </form>
    </div>
  );
}

export default FormEvent;
