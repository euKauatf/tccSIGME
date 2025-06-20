import { Link, useNavigate } from "react-router-dom";
import "./style.css";

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();

    // Aqui que vai vir a logica de autenticação do usuário

    navigate("/home");
  };

  return (
    <div className="flex flex-col h-screen font-san">
      {/* -=-=-=-=-=-=-=-=-=-=-=-=- Área Centralizada do Conteúdo -=-=-=-=-=-=-=-=-=-=-=-=- */}
      <div className="flex flex-grow items-center justify-center">
        {/* -=-=-=-=-=-=-=-=-=-=-=- Card de Login -=-=-=-=-=-=-=-=-=-=-=- */}
        <div className="w-[387px] h-[446px] bg-white rounded-[20px] glass px-6 py-4 flex flex-col items-center justify-between">
          {/* -=-=-=-=-=-=-=-=-=-=-=- Cabeçalho do Card -=-=-=-=-=-=-=-=-=-=-=- */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-emerald-800">SIGME</h1>
            <h2 className="text-2xl text-emerald-600 leading-tight mt-1">
              Sistema Integrado de Gestão e Matrículas da Expocanp
            </h2>
          </div>
          {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */}

          {/* -=-=-=-=-=-=-=-=-=-=-=- Formulário de Login -=-=-=-=-=-=-=-=-=-=-=- */}
          <form
            className="w-full flex flex-col gap-3 mt-4"
            onSubmit={handleLogin}
          >
            {/* Campo de E-mail */}
            <div>
              <p className="text-sm mb-1">Digite o seu E-Mail</p>
              <label className="input validator">
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </g>
                </svg>
                <input type="email" placeholder="seuemail@site.com" required />
              </label>
            </div>

            {/* Campo de Senha */}
            <div>
              <p className="text-sm mb-1">Digite a sua senha</p>
              <label className="input validator">
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                    <circle
                      cx="16.5"
                      cy="7.5"
                      r=".5"
                      fill="currentColor"
                    ></circle>
                  </g>
                </svg>
                <input
                  type="password"
                  required
                  placeholder="Senha"
                  minLength={8}
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  title="A senha deve ter mais de 8 caracteres, incluindo números e letras maiúsculas e minúsculas."
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-2 py-2 rounded-full bg-emerald-600 text-white font-semibold text-lg hover:bg-emerald-700 transition"
            >
              Logar
            </button>
          </form>
          {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */}

          {/* -=-=-=-=-=-=-=-=-=-=-=- Rodapé do Card -=-=-=-=-=-=-=-=-=-=-=- */}
          <div className="text-center text-sm mt-2">
            <a href="#" className="text-emerald-800 underline block">
              Esqueceu sua senha?
            </a>
            <span>
              Ainda não tem uma conta?{" "}
              <Link to="/register" className="text-emerald-800 underline">
                Cadastre-se aqui!
              </Link>
            </span>
          </div>
          {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */}
        </div>
      </div>
      {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=- */}
    </div>
  );
}

export default LoginPage;
