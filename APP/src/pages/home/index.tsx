import { useUser } from "../../hooks/useUser";
import "./style.css";

function HomePage() {
  const { user } = useUser();
  const isAdmin = user?.tipo === 'adm';

  return (
    <div className="main font-sans flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold text-center text-emerald-800 py-3">
        Bem-vindo(a) ao SIGME,<br />{user?.name}!
      </h1>

      {isAdmin ? (
        <>
          <div className="gap-6 flex flex-row justify-between w-full">
            <div className="flex flex-col pl-28 gap-6">
              <div className="flex flex-col glass rounded-[20px] min-h-[170px] mb-30 px-6 bg-emerald-50">
                <h2 className="text-[36px] text-emerald-600 py-3 text-center">
                  Atividades
                </h2>
                <p>Local para adicionar/mudar todas as atividades registradas.</p>
                <p className="linkpage font-bold text-zinc-950 btn-link">
                  <a href="/events">Clique aqui para acessar!</a>
                </p>
              </div>

              <div className="flex flex-col glass rounded-[20px] min-h-[170px] px-6 bg-emerald-50">
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
              <div className="flex flex-col glass rounded-[20px] min-h-[170px] px-6 bg-emerald-50">
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
        </>
      ) : (
        <>
          <div className="gap-6 flex flex-row justify-between w-full">
            <div className="flex flex-col pl-28 gap-6">
              <div className="flex flex-col glass rounded-[20px] min-h-[170px] mb-30 px-6 bg-emerald-50">
                <h2 className="text-[36px] text-emerald-600 py-3 text-center">
                  Atividades Selecionadas
                </h2>
                <p>Você ainda não está em uma atividade.</p>
                <p className="linkpage font-bold text-zinc-950 btn-link">
                  <a href="#">Escolha aqui quais serão!</a>
                </p>
              </div>

              <div className="flex flex-col glass rounded-[20px] min-h-[170px] px-6 bg-emerald-50">
                <h2 className="text-[36px] text-emerald-600 py-3 text-center">
                  Inscrições
                </h2>
                <p>Entre e descubra qual será a proxima atividade!</p>
                <p className="linkpage font-bold text-zinc-950 btn-link">
                  <a href="#">Escolha aqui quais serão!</a>
                </p>
              </div>
            </div>

            <div className="flex pr-28 gap-6">
              <div className="flex flex-col glass rounded-[20px] min-h-[170px] px-6 bg-emerald-50">
                <h2 className="text-[36px] text-emerald-600 py-3 text-center">
                  Próximas Atividades
                </h2>
                <p>Você ainda não está em uma atividade.</p>
                <p className="linkpage font-bold text-zinc-950 btn-link">
                  <a href="#">Escolha aqui quais serão!</a>
                </p>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

export default HomePage;