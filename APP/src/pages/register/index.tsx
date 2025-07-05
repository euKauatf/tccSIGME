import { Link, useNavigate } from "react-router-dom";
import "./style.css";
<<<<<<< HEAD
// --- INÍCIO DAS LÓGICAS ---
=======
// --- INÍCIO DAS ALTERAÇÕES LÓGICAS ---
>>>>>>> 450da4c (Criação das páginas da sidebar e implementação da página de alunos para administradores)
import { useState } from "react";
import apiClient from "../../api/apiClient"; // Verifique se o caminho está correto

function RegisterPage() {
  const navigate = useNavigate();

  // Estados para guardar os dados de cada campo do formulário
  const [name, setName] = useState('');
  const [matricula, setMatricula] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');

  // Função para lidar com o submit do formulário de registro
  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault(); // Previne o recarregamento da página
    setError(''); // Limpa erros antigos

    // Validação simples no frontend para senhas
    if (password !== password_confirmation) {
        setError("As senhas não coincidem.");
        return;
    }

    try {
      // Envia os dados dos estados para a API no backend
      await apiClient.post('/register', {
        name,
        matricula,
        cpf,
        email,
        password,
        password_confirmation
      });

      alert('Registro realizado com sucesso! Por favor, faça o login.');
      // Redireciona o usuário para a página de login após o registro
      navigate("/");

    } catch (err: any) {
        console.error('Erro no registro:', err);
        // Pega os erros de validação do Laravel e os exibe
        if (err.response && err.response.data && err.response.data.errors) {
            const errorMessages = Object.values(err.response.data.errors).flat();
            setError(errorMessages.join(' '));
        } else {
            setError('Ocorreu um erro no registro. Verifique os dados.');
        }
    }
  };
<<<<<<< HEAD
  // --- FIM DAS LÓGICAS ---
=======
  // --- FIM DAS ALTERAÇÕES LÓGICAS ---
>>>>>>> 450da4c (Criação das páginas da sidebar e implementação da página de alunos para administradores)

  return (
    <div className="flex flex-col h-screen font-san">
      {/* -=-=-=-=-=-=-=-=-=-=-=-=- Área Centralizada do Conteúdo -=-=-=-=-=-=-=-=-=-=-=-=- */}
      <div className="flex flex-grow items-center justify-center">
        {/* -=-=-=-=-=-=-=-=-=-=-=- Card de Registro -=-=-=-=-=-=-=-=-=-=-=- */}
        <div className="w-[387px] min-h-[580px] bg-white rounded-[20px] glass px-6 py-4 flex flex-col items-center justify-between">
          {/* -=-=-=-=-=-=-=-=-=-=-=- Cabeçalho do Card -=-=-=-=-=-=-=-=-=-=-=- */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-emerald-800">SIGME</h1>
            <h2 className="text-2xl text-emerald-600 leading-tight mt-1">
              Sistema Integrado de Gestão e Matrículas da Expocanp
            </h2>
          </div>
          {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */}

          {/* -=-=-=-=-=-=-=-=-=-=-=- Formulário de Registro -=-=-=-=-=-=-=-=-=-=-=- */}
          <form
            className="w-full flex flex-col gap-3 mt-4"
            onSubmit={handleRegister}
          >
            {/* Campo de Nome Completo (Necessário para o backend) */}
            <div>
              <p className="text-sm mb-1">Digite o seu nome completo</p>
              <label className="input validator">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88a9.947 9.947 0 0 1 12.28 0C16.43 19.18 14.03 20 12 20z" fill="currentColor"></path></svg>
                <input type="text" placeholder="Nome Completo" required value={name} onChange={e => setName(e.target.value)} />
              </label>
            </div>

            {/* Campo de Matrícula */}
            <div>
              <p className="text-sm mb-1">Digite a sua matrícula</p>
              <label className="input validator">
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M19 2a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h14zm-1 2H6v16h12V4zm-3 4h-6v2h6V8zm0 4h-6v2h6v-2z"
                    fill="currentColor"
                  ></path>
                </svg>
                <input type="text" placeholder="Sua matrícula" required value={matricula} onChange={e => setMatricula(e.target.value)} />
              </label>
            </div>

            {/* Campo de CPF */}
            <div>
              <p className="text-sm mb-1">Digite o seu CPF</p>
              <label className="input validator">
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2M4 6h16v2H4zm0 4h16v2H4zm0 4h16v2H4z"
                  ></path>
                </svg>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  required
                  pattern="\d{3}\.?\d{3}\.?\d{3}-?\d{2}"
                  title="Digite um CPF válido (com ou sem pontuação)"
                  value={cpf} onChange={e => setCpf(e.target.value)}
                />
              </label>
            </div>

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
                <input type="email" placeholder="seuemail@site.com" required value={email} onChange={e => setEmail(e.target.value)} />
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
                  value={password} onChange={e => setPassword(e.target.value)}
                />
              </label>
            </div>
            
            {/* Campo de Confirmação de Senha (Necessário para o backend) */}
            <div>
              <p className="text-sm mb-1">Confirme a sua senha</p>
              <label className="input validator">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle></g></svg>
                <input type="password" required placeholder="Confirme a senha" value={password_confirmation} onChange={e => setPasswordConfirmation(e.target.value)} />
              </label>
            </div>

            {/* Espaço para exibir mensagens de erro */}
            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

            <button
              type="submit"
              className="mt-2 py-2 rounded-full bg-emerald-600 text-white font-semibold text-lg hover:bg-emerald-700 transition"
            >
              Registrar
            </button>
          </form>
          {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */}

          {/* -=-=-=-=-=-=-=-=-=-=-=- Rodapé do Card -=-=-=-=-=-=-=-=-=-=-=- */}
          <div className="text-center text-sm mt-2">
            <a href="#" className="text-emerald-800 underline block">
              Esqueceu sua senha?
            </a>
            <span>
              Já possui uma conta?{" "}
              <Link to="/" className="text-emerald-800 underline">
                Clique aqui para logar!
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

export default RegisterPage;