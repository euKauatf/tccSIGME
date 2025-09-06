// !!! Formulário para criar um evento novo !!!

// IMPORTAÇÕES
import { useState, useEffect, Fragment } from "react"; // <--- A CORREÇÃO ESTÁ AQUI
import axios, { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { IMaskInput } from 'react-imask';
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { type Palestrante } from "../../types";
import { getPalestrantes } from "../../api/apiClient";


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

  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Para armazenar mensagens de erro

  const navigate = useNavigate(); // Importa o useNavigate para redirecionar para a página de eventos

  const [palestrantes, setPalestrantes] = useState<Palestrante[]>([]);
  const [selectedPalestrante, setSelectedPalestrante] = useState<Palestrante | null>(null);
  const [query, setQuery] = useState('')

  useEffect(() => {
    const fetchPalestrantes = async () => {
      try {
        const response = await getPalestrantes();
        setPalestrantes(response.data);
      } catch (error) {
        console.error("Erro ao buscar palestrantes:", error);
      }
    };

    fetchPalestrantes();
  }, []);

  const filteredPalestrantes =
    query === ''
      ? palestrantes
      : palestrantes.filter((palestrante) =>
        palestrante.name
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.toLowerCase().replace(/\s+/g, ''))
      )

  useEffect(() => { // Se existir uma mensagem de erro, role a página para o topo
    if (errorMessage) {
      window.scrollTo({
        top: 0, // Rola para a coordenada 0 (topo)
        behavior: 'smooth' // Faz a rolagem ser de levs
      });
    }
  }, [errorMessage]);

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

    if (eventData.horario_inicio >= eventData.horario_termino) { // Verifica se o horário de início é maior ou igual ao horário de término
      setErrorMessage("O horário de início deve ser anterior ao horário de término.");
      return; // Para a execução para não enviar dados inválidos
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/event", eventData);
      navigate("/events", {
        state: { message: "Evento criado com sucesso!" }
      });
    } catch (error) {
      let message = 'Ocorreu um erro inesperado. Tente novamente mais tarde.';

      if (isAxiosError(error) && error.response) {
        const responseData = error.response.data;

        if (responseData.errors) {
          const firstErrorKey = Object.keys(responseData.errors)[0];
          message = responseData.errors[firstErrorKey][0];
        }
        else if (responseData.message) {
          message = responseData.message;
        }
      }

      setErrorMessage(message);
    }
  };

  // RENDERIZAÇÃO DO SITE
  return (
    <div className="flex items-center justify-center w-full p-4"> {/* Div principal que centraliza o formulário */}
      <div className="w-full max-w-2xl"> {/* Div que contém o formulário */}

        {errorMessage && (
          <div role="alert" className="mb-4 alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 stroke-current shrink-0" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Cardzinho bonitinho pei pei pei aqui abaixo */}
        <div className="flex flex-col divp rounded-[20px] p-6 sm:p-8 bg-emerald-50 shadow-lg min-h-[170px]">
          <h1 className="py-3 text-3xl font-bold text-center text-emerald-600">
            Criar Evento
          </h1>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div> {/* Tema do evento */}
              <label htmlFor="tema" className="block text-sm font-medium text-gray-700">Tema do Evento</label>
              <input name="tema" value={formData.tema} onChange={handleChange} type="text" placeholder="Tema do Evento" className="w-full input input-bordered" required />
            </div>

            <div> {/* Vagas máximas */}
              <label htmlFor="vagas_max" className="block text-sm font-medium text-gray-700">Quantidade de Vagas</label>
              <input name="vagas_max" value={formData.vagas_max} onChange={handleChange} type="number" placeholder="Quantidade de Vagas" className="w-full input input-bordered" required />
            </div>

            <div> {/* Palestrante do evento */}
              <label htmlFor="palestrante" className="block text-sm font-medium text-gray-700">Palestrante</label>
              <Combobox
                value={selectedPalestrante}
                onChange={(palestrante: Palestrante | null) => {
                  setSelectedPalestrante(palestrante);
                  if (palestrante) {
                    setFormData((prevState) => ({
                      ...prevState,
                      palestrante: palestrante.name,
                      email_palestrante: palestrante.email,
                      telefone_palestrante: palestrante.telefone,
                    }));
                  }
                }}
              >
                <div className="relative mt-1">
                  <div>
                    <Combobox.Input
                      className="w-full input input-bordered"
                      value={formData.palestrante}
                      placeholder="Selecione um palestrante"
                      onChange={(event) => {
                        const newQuery = event.target.value;
                        setQuery(newQuery);
                        setSelectedPalestrante(null); // Desseleciona ao digitar manualmente
                        setFormData((prevState) => ({
                          ...prevState,
                          palestrante: newQuery,
                          // Limpa os campos dependentes na alteração manual
                          email_palestrante: '',
                          telefone_palestrante: '',
                        }));
                      }}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="w-5 h-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Combobox.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery('')}
                  >
                    <Combobox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base rounded-md shadow-lg max-h-60 ring-1 ring-black/5 focus:outline-none sm:text-sm">
                      {filteredPalestrantes.length === 0 && query !== '' ? (
                        <div className="relative px-4 py-2 text-gray-700 cursor-default select-none">
                          Nenhum palestrante encontrado.
                        </div>
                      ) : (
                        filteredPalestrantes.map((palestrante) => (
                          <Combobox.Option
                            key={palestrante.id}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-teal-600 text-white' : 'text-gray-900'}`
                            }
                            value={palestrante}
                          >
                            {({ selected, active }) => (
                              <>
                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                  {palestrante.name}
                                </span>
                                {selected ? (
                                  <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-teal-600'}`}>
                                    <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Combobox.Option>
                        ))
                      )}
                    </Combobox.Options>
                  </Transition>
                </div>
              </Combobox>
            </div>


            <div> {/* Email do palestrante */}
              <label htmlFor="email_palestrante" className="block text-sm font-medium text-gray-700">Email do Palestrante</label>
              <input name="email_palestrante" value={formData.email_palestrante} onChange={handleChange} type="text" placeholder="Email" className="w-full input input-bordered" disabled required />
            </div>

            <div> {/* Telefone do palestrante */}
              <label htmlFor="telefone_palestrante" className="block text-sm font-medium text-gray-700">Telefone do Palestrante</label>
              <IMaskInput mask="(00) 00000-0000" disabled name="telefone_palestrante" value={formData.telefone_palestrante} placeholder="(00) 00000-0000" className="w-full input input-bordered" required onAccept={(value) => { setFormData(prevState => ({ ...prevState, telefone_palestrante: value as string, })); }} />
            </div>

            <div> {/* Local do evento */}
              <label htmlFor="local" className="block text-sm font-medium text-gray-700">Local</label>
              <input name="local" value={formData.local} onChange={handleChange} type="text" placeholder="Local" className="w-full input input-bordered" required />
            </div>

            <div> {/* Dia do evento */}
              <label htmlFor="data" className="block text-sm font-medium text-gray-700">Data</label>
              <select id="data" name="data" value={formData.data} onChange={handleChange} className="w-full mt-1 select select-bordered" required>
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
              <input name="horario_inicio" value={formData.horario_inicio} onChange={handleChange} placeholder="00:00" type="time" className="w-full input input-bordered" required />
            </div>

            <div> {/* Horário de término (Preciso mudar o tipo do input) */}
              <label htmlFor="horario_termino" className="block text-sm font-medium text-gray-700">Horário de Término</label>
              <input id="horario_termino" name="horario_termino" value={formData.horario_termino} onChange={handleChange} type="time" className="w-full input input-bordered" required />
            </div>

            <div> {/* Descrição do evento */}
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição</label>
              <textarea maxLength={400} name="descricao" id="descricao" value={formData.descricao} onChange={handleChange} placeholder="Descrição" className="w-full textarea textarea-bordered" required />
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-4 mt-6">
              <button type="button" onClick={() => navigate("/events")} className="btn btn-ghost" > Cancelar </button>
              <button type="submit" className="text-white btn btn-success"> Criar Evento </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default FormEvent;