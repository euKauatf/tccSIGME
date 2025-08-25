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
  const TotalEventosInscritos = user?.eventos ? user.eventos.length : 0; // Pega o total de eventos inscritos
  const TotalEventosSelecionados = user?.eventos ? user.eventos.filter(e => e.pivot?.status === "selecionado").length : 0; // Pega o total de eventos selecionados

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
    <div className="main font-sans flex flex-col items-center justify-start min-h-screen p-4 sm:p-6 lg:p-0">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-emerald-800 py-3 lg:py-6">
        Bem-vindo(a) ao SIGME,<br />{user?.name}!
      </h1>

      {/*Versão pra mobile */}
      {isAdmin ? (
        <div className="w-full mt-6">
          <div className="flex flex-col items-center gap-4 lg:hidden">
            <div className="flex flex-col divp rounded-[20px] p-6 bg-emerald-50 w-full max-w-md">
              <h2 className="text-2xl text-emerald-600 py-3 text-center">
                Atividades
              </h2>
              <p>Local para adicionar/mudar todas as atividades registradas.</p>
              <p className="linkpage font-bold text-zinc-950 btn-link">
                <a href="/events">Clique aqui para acessar!</a>
              </p>
            </div>

            <div className="flex flex-col divp rounded-[20px] p-6 bg-emerald-50 w-full max-w-md">
              <h2 className="text-2xl text-emerald-600 py-3 text-center">
                Inscrições
              </h2>
              <p>Local para gerenciar as inscrições dos alunos.</p>
              <p className="linkpage font-bold text-zinc-950 btn-link mt-2">
                <a href="#">Clique para acessar as inscrições!</a>
              </p>
            </div>

            <div className="flex flex-col divp rounded-[20px] p-6 bg-emerald-50 w-full max-w-md">
              <h2 className="text-2xl text-emerald-600 py-3 text-center">
                Próximas Atividades
              </h2>
              <p>Veja aqui quais serão as próximas atividades!</p>
              <p className="linkpage font-bold text-zinc-950 btn-link mt-2">
                <a href="#">Ainda não há atividades no sistema.</a>
              </p>
            </div>
          </div>

          {/*Versão para desktop*/}
          <div className="hidden lg:flex gap-6 flex-row justify-between w-full">
            <div className="flex flex-col pl-28 gap-6">
              <div className="flex flex-col divp rounded-[20px] min-h-[170px] mb-30 px-6 bg-emerald-50">
                <h2 className="text-[36px] text-emerald-600 py-3 text-center">
                  Atividades
                </h2>
                <p>Local para adicionar/mudar todas as atividades registradas.</p>
                <p className="linkpage font-bold text-zinc-950 btn-link">
                  <a href="/events">Clique aqui para acessar!</a>
                </p>
              </div>
              <div className="flex flex-col divp rounded-[20px] min-h-[170px] px-6 bg-emerald-50">
                <h2 className="text-[36px] text-emerald-600 py-3 text-center">
                  Inscrições
                </h2>
                <p>Local para gerenciar as inscrições dos alunos.</p>
                <p className="linkpage font-bold text-zinc-950 btn-link">
                  <a href="#">Clique para acessar as inscrições!</a>
                </p>
              </div>
            </div>
            <div className="flex pr-28 gap-6">
              <div className="flex flex-col divp rounded-[20px] min-h-[170px] px-6 bg-emerald-50">
                <h2 className="text-[36px] text-emerald-600 py-3 text-center">
                  Próximas Atividades
                </h2>
                <p>Veja aqui quais serão as próximas atividades!</p>
                <p className="linkpage font-bold text-zinc-950 btn-link">
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
              <h2 className="text-2xl text-emerald-600 py-3 text-center">
                Sorteios Inscritos
              </h2>
              {TotalEventosInscritos > 0 ? (
                <>
                  <p>Você está concorrendo a <span className="font-bold">{TotalEventosInscritos}</span> sorteios!</p>
                  <p className="linkpage font-bold text-zinc-950 btn-link mt-2">
                    <a href="/events?filter=pendentes">Veja aqui quais são!</a>
                  </p>
                </>
              ) : (
                <>
                  <p>Você ainda não está concorrendo a nenhum sorteio de atividade.</p>
                  <p className="linkpage font-bold text-zinc-950 btn-link mt-2">
                    <a href="/events">Escolha aqui quais serão!</a>
                  </p>
                </>
              )}
            </div>

            <div className="flex flex-col divp rounded-[20px] p-6 bg-emerald-50 w-full max-w-md">
              <h2 className="text-2xl text-emerald-600 py-3 text-center">
                Atividades Selecionadas
              </h2>
              <p>Você está selecionado em <span className="font-bold">{TotalEventosSelecionados}</span> atividades!</p>
              <p className="linkpage font-bold text-zinc-950 btn-link mt-2">
                <a href="/events?filter=selecionados">Clique para ver as atividades que participará!</a>
              </p>
            </div>

            <div className="flex flex-col divp rounded-[20px] p-6 bg-emerald-50 w-full max-w-md">
              <h2 className="text-2xl text-emerald-600 py-3 text-center">
                Próximas Atividades
              </h2>

              {proximosEventosSelecionados.length > 0 ? (
                <ul className="w-full space-y-2 flex-grow">
                  {proximosEventosSelecionados.map(evento => (
                    <li key={evento.id} className="text-center divp bg-emerald-50 p-3 rounded-lg shadow-sm">
                      <div className="font-bold text-emerald-800">{evento.tema}</div>
                      <div className="text-sm font-bold text-gray-950">{evento.data} às {evento.horario_inicio}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex-grow flex items-center justify-center">
                  <p className="text-gray-600 text-center">Você não tem atividades agendadas.</p>
                </div>
              )}

              <p className="linkpage font-bold text-zinc-950 btn-link mt-auto py-4 text-center">
                <Link to="/events">Ver todas as atividades</Link>
              </p>
            </div>
          </div>


          {/*Versão pra desktop */}
          <div className="hidden lg:flex gap-6 flex-row justify-between w-full">
            <div className="flex flex-col pl-28 gap-6">
              <div className="flex flex-col divp rounded-[20px] min-h-[170px] mb-30 px-6 bg-emerald-50">
                <h2 className="text-[36px] text-emerald-600 py-3 text-center">
                  Sorteios Inscritos
                </h2>
                {TotalEventosInscritos > 0 ? (
                  <>
                    <p>Você está concorrendo a <span className="font-bold">{TotalEventosInscritos}</span> sorteios!</p>
                    <p className="linkpage font-bold text-zinc-950 btn-link">
                      <a href="/events?filter=pendentes">Veja aqui quais são!</a>
                    </p>
                  </>
                ) : (
                  <>
                    <p>Você ainda não está concorrendo a nenhum sorteio de atividade.</p>
                    <p className="linkpage font-bold text-zinc-950 btn-link">
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
                <p className="linkpage font-bold text-zinc-950 btn-link">
                  <a href="/events?filter=selecionados">Clique para ver as atividades que participará!</a>
                </p>
              </div>
            </div>
            <div className="flex pr-28 gap-6">
              <div className="flex flex-col divp rounded-[20px] min-h-[170px] px-6 bg-emerald-50">
                <h2 className="text-[36px] text-emerald-600 py-3 text-center">
                  Próximas Atividades
                </h2>
                {proximosEventosSelecionados.length > 0 ? (
                  <ul className="w-full space-y-2 flex-grow">
                    {proximosEventosSelecionados.map(evento => (
                      <li key={evento.id} className="text-center divp bg-emerald-50 p-3 rounded-lg shadow-sm">
                        <div className="font-bold text-emerald-800">{evento.tema}</div>
                        <div className="text-sm font-bold text-gray-950">{evento.data} às {evento.horario_inicio}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex-grow flex items-center justify-center">
                    <p className="text-black text-center">Você não tem atividades agendadas.</p>
                  </div>
                )}
                <p className="linkpage font-bold text-zinc-950 btn-link mt-auto py-4 text-center">
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