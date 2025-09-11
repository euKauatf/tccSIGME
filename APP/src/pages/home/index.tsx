// !!! Página inicial do site, quando você já tá logado !!!

// IMPORTAÇÕES
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import apiClient from "../../api/apiClient";
import type { Event } from "../../types";
import "./style.css";

function HomePage() {
  const { user, isAdmin } = useUser(); // Pega o usuário logado e verifica se é admin
  const [, setAllEvents] = useState<Event[]>([]); // Estado que armazena todos os eventos (funciona só com a , sla pq)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsResponse] = await Promise.all([
          apiClient.get("/event"),
        ]);

        setAllEvents(eventsResponse.data);

      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    };
    fetchData();
  }, []);

  const ordemDosDias = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"]; // Array com os dias da semana
  const diasJs = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]; // Array com os dias totais da semana
  const hojeIndex = new Date().getDay(); // Pega o dia da semana atual
  const nomeHoje = diasJs[hojeIndex]; // Pega o nome do dia da semana atual
  const indiceHojeNaSemana = ordemDosDias.indexOf(nomeHoje); // Pega o índice do dia da semana atual na semana
  const TotalEventosInscritos = user?.eventos ? user.eventos.filter(e => e.pivot?.status === "inscrito").length : 0; // Pega o total de eventos inscritos
  const TotalEventosSelecionados = user?.eventos ? user.eventos.filter(e => e.pivot?.status === "contemplado").length : 0; // Pega o total de eventos selecionados

  const proximosEventosSelecionados = user?.eventos // Pega os 3 próximos eventos selecionados do usuário
    ? user.eventos
      .filter(e => {
        const indiceEvento = ordemDosDias.indexOf(e.data);
        return indiceHojeNaSemana !== -2 && indiceEvento >= indiceHojeNaSemana; // MUDA PRA -1 PRA ACERTAR O CÓDIGO
      })
      .sort((a, b) => {
        const indiceA = ordemDosDias.indexOf(a.data);
        const indiceB = ordemDosDias.indexOf(b.data);
        if (indiceA !== indiceB) return indiceA - indiceB;
        return a.horario_inicio.localeCompare(b.horario_inicio);
      })
      .slice(0, 3)
    : [];

  // Site rsrsrs
  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 font-sans main sm:p-6 lg:p-0">
      <h1 className="py-3 text-4xl font-bold text-center md:text-5xl text-emerald-800 lg:py-6">
        Bem-vindo(a) ao SIGME,<br />{user?.name}!
      </h1>

      {/*Versão pra mobile */}
      {isAdmin ? (
        <div className="w-full mt-6">
          <div className="flex flex-col items-center gap-4 lg:hidden">
            <div className="flex flex-col divp rounded-[20px] p-6 bg-emerald-50 w-full max-w-md">
              <h2 className="py-3 text-2xl text-center text-emerald-600">
                Atividades
              </h2>
              <p>Local para adicionar/mudar todas as atividades registradas.</p>
              <p className="font-bold linkpage text-zinc-950 btn-link">
                <a href="/events">Clique aqui para acessar!</a>
              </p>
            </div>

            <div className="flex flex-col divp rounded-[20px] p-6 bg-emerald-50 w-full max-w-md">
              <h2 className="py-3 text-2xl text-center text-emerald-600">
                Inscrições
              </h2>
              <p>Local para gerenciar as inscrições dos alunos.</p>
              <p className="mt-2 font-bold linkpage text-zinc-950 btn-link">
                <a href="#">Clique para acessar as inscrições!</a>
              </p>
            </div>

            <div className="flex flex-col divp rounded-[20px] p-6 bg-emerald-50 w-full max-w-md">
              <h2 className="py-3 text-2xl text-center text-emerald-600">
                Próximas Atividades
              </h2>
              <p>Veja aqui quais serão as próximas atividades!</p>
              <p className="mt-2 font-bold linkpage text-zinc-950 btn-link">
                <a href="#">Ainda não há atividades no sistema.</a>
              </p>
            </div>
          </div>

          {/*Versão para desktop*/}
          <div className="flex-row justify-between hidden w-full gap-6 lg:flex">
            <div className="flex flex-col gap-6 pl-28">
              <div className="flex flex-col divp rounded-[20px] min-h-[170px] mb-30 px-6 bg-emerald-50">
                <h2 className="text-[36px] text-emerald-600 py-3 text-center">
                  Atividades
                </h2>
                <p>Local para adicionar/mudar todas as atividades registradas.</p>
                <p className="font-bold linkpage text-zinc-950 btn-link">
                  <a href="/events">Clique aqui para acessar!</a>
                </p>
              </div>
              <div className="flex flex-col divp rounded-[20px] min-h-[170px] px-6 bg-emerald-50">
                <h2 className="text-[36px] text-emerald-600 py-3 text-center">
                  Inscrições
                </h2>
                <p>Local para gerenciar as inscrições dos alunos.</p>
                <p className="font-bold linkpage text-zinc-950 btn-link">
                  <a href="#">Clique para acessar as inscrições!</a>
                </p>
              </div>
            </div>
            <div className="flex gap-6 pr-28">
              <div className="flex flex-col divp rounded-[20px] min-h-[170px] px-6 bg-emerald-50">
                <h2 className="text-[36px] text-emerald-600 py-3 text-center">
                  Próximas Atividades
                </h2>
                <p>Veja aqui quais serão as próximas atividades!</p>
                <p className="font-bold linkpage text-zinc-950 btn-link">
                  <a href="#">Ainda não há atividades no sistema.</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Versão pra mobile
        <div className="w-full mt-6">
          <div className="flex flex-col items-center gap-4 lg:hidden">
            <div className="flex flex-col divp rounded-[20px] p-6 bg-emerald-50 w-full max-w-md">
              <h2 className="py-3 text-2xl text-center text-emerald-600">
                Sorteios Inscritos
              </h2>
              {TotalEventosInscritos > 0 ? (
                <>
                  <p>Você está concorrendo a <span className="font-bold">{TotalEventosInscritos}</span> sorteios!</p>
                  <p className="mt-2 font-bold linkpage text-zinc-950 btn-link">
                    <a href="/events?filter=pendentes">Veja aqui quais são!</a>
                  </p>
                </>
              ) : (
                <>
                  <p>Você ainda não está concorrendo a nenhum sorteio de atividade.</p>
                  <p className="mt-2 font-bold linkpage text-zinc-950 btn-link">
                    <a href="/events">Escolha aqui quais serão!</a>
                  </p>
                </>
              )}
            </div>

            <div className="flex flex-col divp rounded-[20px] p-6 bg-emerald-50 w-full max-w-md">
              <h2 className="py-3 text-2xl text-center text-emerald-600">
                Atividades Selecionadas
              </h2>
              <p>Você está selecionado em <span className="font-bold">{TotalEventosSelecionados}</span> atividades!</p>
              <p className="mt-2 font-bold linkpage text-zinc-950 btn-link">
                <a href="/events?filter=selecionados">Clique para ver as atividades que participará!</a>
              </p>
            </div>

            <div className="flex flex-col divp rounded-[20px] p-6 bg-emerald-50 w-full max-w-md">
              <h2 className="py-3 text-2xl text-center text-emerald-600">
                Próximas Atividades
              </h2>

              {proximosEventosSelecionados.length > 0 ? (
                <ul className="flex-grow w-full space-y-2">
                  {proximosEventosSelecionados.map(evento => (
                    <li key={evento.id} className="p-3 text-center rounded-lg shadow-sm divp bg-emerald-50">
                      <div className="font-bold text-emerald-800">{evento.tema}</div>
                      <div className="text-sm font-bold"><p>{evento.data} às {evento.horario_inicio}</p></div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center justify-center flex-grow">
                  <p className="text-center text-gray-600">Você não tem atividades agendadas.</p>
                </div>
              )}

              <p className="py-4 mt-auto font-bold text-center linkpage text-zinc-950 btn-link">
                <Link to="/events">Ver todas as atividades</Link>
              </p>
            </div>
          </div>


          {/*Versão pra desktop */}
          <div className="flex-row justify-between hidden w-full gap-6 lg:flex">
            <div className="flex flex-col gap-6 pl-28">
              <div className="flex flex-col divp rounded-[20px] min-h-[170px] mb-30 px-6 bg-emerald-50">
                <h2 className="text-[36px] text-emerald-600 py-3 text-center">
                  Sorteios Inscritos
                </h2>
                {TotalEventosInscritos > 0 ? (
                  <>
                    <p>Você está concorrendo a <span className="font-bold">{TotalEventosInscritos}</span> sorteios!</p>
                    <p className="font-bold linkpage text-zinc-950 btn-link">
                      <a href="/events?filter=pendentes">Veja aqui quais são!</a>
                    </p>
                  </>
                ) : (
                  <>
                    <p>Você ainda não está concorrendo a nenhum sorteio de atividade.</p>
                    <p className="font-bold linkpage text-zinc-950 btn-link">
                      <a href="/events">Escolha aqui quais serão!</a>
                    </p>
                  </>
                )}
              </div>
              <div className="flex flex-col divp rounded-[20px] min-h-[170px] px-6 bg-emerald-50">
                <h2 className="text-[36px] text-emerald-600 py-3 text-center">
                  Atividades Selecionadas
                </h2>
                <p>Você está selecionado em <span className="font-bold">{TotalEventosSelecionados}</span> atividades!</p>
                <p className="font-bold linkpage text-zinc-950 btn-link">
                  <a href="/events?filter=selecionados">Clique para ver as atividades que participará!</a>
                </p>
              </div>
            </div>
            <div className="flex gap-6 pr-28">
              <div className="flex flex-col divp rounded-[20px] min-h-[170px] px-6 bg-emerald-50">
                <h2 className="text-[36px] text-emerald-600 py-3 text-center">
                  Próximas Atividades
                </h2>
                {proximosEventosSelecionados.length > 0 ? (
                  <ul className="flex-grow w-full space-y-2">
                    {proximosEventosSelecionados.map(evento => (
                      <li key={evento.id} className="p-3 text-center rounded-lg shadow-sm divp bg-emerald-50">
                        <div className="font-bold text-emerald-800">{evento.tema}</div>
                        <div className="text-sm font-bold">{evento.data} às {evento.horario_inicio}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center justify-center flex-grow">
                    <p className="text-center text-black">Você não tem atividades agendadas.</p>
                  </div>
                )}
                <p className="py-4 mt-auto font-bold text-center linkpage text-zinc-950 btn-link">
                  <Link to="/events">Ver todas as atividades</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )
      }
    </div >
  );
}

export default HomePage;