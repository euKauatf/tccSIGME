import { useState, useEffect, Fragment } from "react";
import axios, { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { IMaskInput } from 'react-imask';
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { type Palestrante, type Local } from "../../types";
import { getPalestrantes, getLocais } from "../../api/apiClient";


function FormEvent() {
  const [formData, setFormData] = useState({
    tema: "",
    vagas_max: "",
    vagas_tot: "",
    palestrante: "",
    email_palestrante: "",
    telefone_palestrante: "",
    local: "",
    data: "",
    horario_inicio: "",
    horario_termino: "",
    descricao: "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const [palestrantes, setPalestrantes] = useState<Palestrante[]>([]);
  const [selectedPalestrante, setSelectedPalestrante] = useState<Palestrante | null>(null);
  const [queryPalestrante, setQueryPalestrante] = useState('')

  const [locais, setLocais] = useState<Local[]>([]);
  const [selectedLocal, setSelectedLocal] = useState<Local | null>(null);
  const [queryLocal, setQueryLocal] = useState('')

  useEffect(() => {
    const fetchPalestrantes = async () => {
      try {
        const response = await getPalestrantes();
        setPalestrantes(response.data);
      } catch (error) {
        console.error("Erro ao buscar palestrantes:", error);
      }
    };

    const fetchLocais = async () => {
      try {
        const response = await getLocais();
        setLocais(response.data);
      } catch (error) {
        console.error("Erro ao buscar locais:", error);
      }
    }

    fetchPalestrantes();
    fetchLocais();
  }, []);

  const filteredPalestrantes =
    queryPalestrante === ''
      ? palestrantes
      : palestrantes.filter((palestrante) =>
        palestrante.name
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(queryPalestrante.toLowerCase().replace(/\s+/g, ''))
      )

  const filteredLocais =
    queryLocal === ''
      ? locais
      : locais.filter((local) =>
        local.name
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(queryLocal.toLowerCase().replace(/\s+/g, ''))
      )

  useEffect(() => {
    if (errorMessage) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [errorMessage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const vagasMax = Number(formData.vagas_max);
    const vagasTot = Number(formData.vagas_tot);

    if (vagasMax <= 0) {
      setErrorMessage("A quantidade de vagas do evento deve ser maior que zero.");
      return;
    }

    if (vagasTot > 0 && vagasMax > vagasTot) {
      setErrorMessage(`O número de vagas do evento (${vagasMax}) não pode exceder a capacidade máxima do local (${vagasTot}).`);
      return;
    }

    if (formData.horario_inicio >= formData.horario_termino) {
      setErrorMessage("O horário de início deve ser anterior ao horário de término.");
      return;
    }

    const { vagas_tot, ...eventDataToSend } = formData;

    try {
      await axios.post("http://127.0.0.1:8000/api/event", {
        ...eventDataToSend,
        vagas_max: Number(eventDataToSend.vagas_max),
      });
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
            Criar Evento
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div>
              <label htmlFor="tema" className="block text-sm font-medium text-gray-700">Tema do Evento</label>
              <input name="tema" value={formData.tema} onChange={handleChange} type="text" placeholder="Tema do Evento" className="w-full input input-bordered" required />
            </div>

            <div> {/* Vagas do Evento */}
              <label htmlFor="vagas_max" className="block text-sm font-medium text-gray-700">Quantidade de Vagas para o Evento</label>
              <input name="vagas_max" value={formData.vagas_max} onChange={handleChange} type="number" placeholder="Defina as vagas para o evento" className="w-full input input-bordered" required />
            </div>

            <div>
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
                        setQueryPalestrante(newQuery);
                        setSelectedPalestrante(null);
                        setFormData((prevState) => ({
                          ...prevState,
                          palestrante: newQuery,
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
                    afterLeave={() => setQueryPalestrante('')}
                  >
                    <Combobox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base rounded-md shadow-lg bg-base-100 max-h-60 ring-1 ring-black/5 focus:outline-none sm:text-sm">
                      {filteredPalestrantes.length === 0 && queryPalestrante !== '' ? (
                        <div className="relative px-4 py-2 cursor-default select-none text-base-content">
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


            <div>
              <label htmlFor="email_palestrante" className="block text-sm font-medium text-gray-700">Email do Palestrante</label>
              <input name="email_palestrante" value={formData.email_palestrante} onChange={handleChange} type="text" placeholder="Email" className="w-full input input-bordered" disabled required />
            </div>

            <div>
              <label htmlFor="telefone_palestrante" className="block text-sm font-medium text-gray-700">Telefone do Palestrante</label>
              <IMaskInput mask="(00) 00000-0000" disabled name="telefone_palestrante" value={formData.telefone_palestrante} placeholder="(00) 00000-0000" className="w-full input input-bordered" required onAccept={(value) => { setFormData(prevState => ({ ...prevState, telefone_palestrante: value as string, })); }} />
            </div>

            <div>
              <label htmlFor="local" className="block text-sm font-medium text-gray-700">Local</label>
              <Combobox
                value={selectedLocal}
                onChange={(local: Local | null) => {
                  setSelectedLocal(local);
                  if (local) {
                    setFormData((prevState) => ({
                      ...prevState,
                      local: local.name,
                      vagas_tot: local.capacidade.toString(),
                    }));
                  }
                }}
              >
                <div className="relative mt-1">
                  <div>
                    <Combobox.Input
                      className="w-full input input-bordered"
                      value={formData.local}
                      placeholder="Selecione um local"
                      onChange={(event) => {
                        const newQuery = event.target.value;
                        setQueryLocal(newQuery);
                        setSelectedLocal(null);
                        setFormData((prevState) => ({
                          ...prevState,
                          local: newQuery,
                          vagas_tot: '',
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
                    afterLeave={() => setQueryLocal('')}
                  >
                    <Combobox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base rounded-md shadow-lg bg-base-100 max-h-60 ring-1 ring-black/5 focus:outline-none sm:text-sm">
                      {filteredLocais.length === 0 && queryLocal !== '' ? (
                        <div className="relative px-4 py-2 cursor-default select-none text-base-content">
                          Nenhum local encontrado.
                        </div>
                      ) : (
                        filteredLocais.map((local) => (
                          <Combobox.Option
                            key={local.id}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-teal-600 text-white' : 'text-gray-900'}`
                            }
                            value={local}
                          >
                            {({ selected, active }) => (
                              <>
                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                  {local.name}
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

            <div>
              <label htmlFor="vagas_tot" className="block text-sm font-medium text-gray-700">Capacidade Máxima do Local</label>
              <input name="vagas_tot" value={formData.vagas_tot} type="number" placeholder="Capacidade do local" className="w-full input input-bordered" disabled />
            </div>

            <div>
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

            <div>
              <label htmlFor="horario_inicio" className="block text-sm font-medium text-gray-700">Horário de Início</label>
              <input name="horario_inicio" value={formData.horario_inicio} onChange={handleChange} placeholder="00:00" type="time" className="w-full input input-bordered" required />
            </div>

            <div>
              <label htmlFor="horario_termino" className="block text-sm font-medium text-gray-700">Horário de Término</label>
              <input id="horario_termino" name="horario_termino" value={formData.horario_termino} onChange={handleChange} type="time" className="w-full input input-bordered" required />
            </div>

            <div>
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição</label>
              <textarea maxLength={400} name="descricao" id="descricao" value={formData.descricao} onChange={handleChange} placeholder="Descrição" className="w-full textarea textarea-bordered" required />
            </div>

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