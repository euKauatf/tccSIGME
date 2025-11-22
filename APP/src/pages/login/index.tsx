import { useNavigate } from "react-router-dom";
import "./style.css";
import { useState } from "react";
import apiClient from "../../api/apiClient";

function LoginPage() {
  const navigate = useNavigate();

  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      const response = await apiClient.post("/login", {
        matricula,
        password,
      });

      const token = response.data.access_token;
      localStorage.setItem("authToken", token);

      navigate("/home");
    } catch (err: any) {
      console.error("Erro no login:", err);
      if (err.response && err.response.status === 401) {
        setError("Matrícula ou senha inválidos.");
      } else {
        setError("Ocorreu um erro. Tente novamente mais tarde.");
      }
    }
  };

  return (
    <div className="flex flex-col h-screen font-san">
      <div className="flex items-center justify-center flex-grow">
        <div className="w-[387px] min-h-[400px] bg-white rounded-[20px] divp px-6 py-4 flex flex-col items-center justify-between">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-emerald-800">SIGME</h1>
            <h2 className="mt-1 text-2xl leading-tight text-emerald-600">
              Sistema Integrado de Gestão e Matrículas da Expocanp
            </h2>
          </div>

          <form
            className="flex flex-col w-full gap-3 mt-4"
            onSubmit={handleLogin}>
            <div>
              <p className="mb-1 text-sm">Digite a sua Matrícula</p>
              <input
                type="text"
                placeholder="Sua matrícula"
                required
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                className="w-full input input-bordered"
              />
            </div>

            <div>
              <p className="mb-1 text-sm">Digite a sua senha</p>
              <input
                type="password"
                required
                placeholder="Senha"
                minLength={8}
                title="A senha deve ter mais de 8 caracteres, incluindo números e letras maiúsculas e minúsculas."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full input input-bordered"
              />
            </div>

            {error && (
              <p className="mt-2 text-sm text-center text-red-500">{error}</p>
            )}

            <button
              type="submit"
              className="py-2 mt-2 text-lg font-semibold text-white transition rounded-full bg-emerald-600 hover:bg-emerald-700">
              Logar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
