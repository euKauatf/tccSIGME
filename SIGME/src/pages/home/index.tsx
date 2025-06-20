import "./style.css";

function HomePage() {
  return (
    <div className="main font-sans flex flex-col items-center justify-center">
      {/* -=-=-=-=-=-=-=-=-=-=-=- Texto do topo do site -=-=-=-=-=-=-=-=-=-=-=- */}
      <h1 className="text-5xl font-bold text-center text-emerald-800 py-3">
        Bem-vindo(a) ao SIGME, <br></br>NOME!
      </h1>
      {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */}

      {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=- Divisão do site -=-=-=-=-=-=-=-=-=--=-=-=-=-=- */}
      <div className="gap-6 flex flex-row justify-between w-full">
        {""}
        {/* -=-=-=-=-=-=-=-=-=-=-=- Lado esquerdo do site -=-=-=-=-=-=-=-=-=-=-=- */}
        <div className="flex flex-col pl-28 gap-6">
          {""}
          {""}
          <div className="flex flex-col glass rounded-[20px] min-h-[170px] mb-30 px-6 bg-emerald-50">
            <h2 className="text-[36px] text-emerald-600 py-3 text-center">
              Eventos Registrados
            </h2>
            <p>Você ainda não está em algum evento.</p>
            <p className="linkpage font-bold text-zinc-950 btn-link">
              <a href="#">Escolha aqui quais serão!</a>
            </p>
          </div>
          {""}
          {""}
          <div className="flex flex-col glass rounded-[20px] min-h-[170px] px-6 bg-emerald-50">
            <h2 className="text-[36px] text-emerald-600 py-3 text-center">
              Inscrições
            </h2>
            <p>Você ainda não está em algum evento.</p>
            <p className="linkpage font-bold text-zinc-950 btn-link">
              <a href="#">Escolha aqui quais serão!</a>
            </p>
          </div>
        </div>
        {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */}

        {/* -=-=-=-=-=-=-=-=-=-=-=- Lado direito do site -=-=-=-=-=-=-=-=-=-=-=- */}
        <div className="flex pr-28 gap-6">
          {""}
          {""}
          <div className="flex flex-col glass rounded-[20px] min-h-[170px] px-6 bg-emerald-50">
            <h2 className="text-[36px] text-emerald-600 py-3 text-center">
              Próximas Atividades
            </h2>
            <p>Você ainda não está em algum evento.</p>
            <p className="linkpage font-bold text-zinc-950 btn-link">
              <a href="#">Escolha aqui quais serão!</a>
            </p>
          </div>
        </div>
        {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=- */}
      </div>
      {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=- */}
    </div>
  );
}

export default HomePage;
