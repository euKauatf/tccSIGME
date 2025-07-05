// LAYOUT PRINCIPAL DAS APLICAÇÕES DO SITE! UTILIZADA EM TODAS AS PÁGINAS!

// -=-=-=-=-=-=-=- Importações -=-=-=-=-=-=-=- //
import { useState, useEffect } from "react"; //funcoes que permitem usar estados e efeitos colaterais
import { Outlet, useNavigate, useOutletContext } from "react-router-dom"; //funcoes que permitem renderizar as paginas e navegar entre elas
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import "./style.css";
import apiClient from "../../api/apiClient"; //importa o cliente da api, pro arquivo se comunicar com o backend

interface User {
  id: number;
  name: string;
  email: string;
}

// Função que retorna o HTML da página
function MainLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null); //cria um estado para o usuario logado, que pode ser o user ou nulo, mas começa nulo

  //pega os dados do usuario logado assim que monta o componente
  useEffect(() => {
    apiClient.get('/user') //pega as informações do usuário logado
      .then(response => { //espera a resposta da api
        setUser(response.data); //usa o hook setUser para atualizar os dados do usuario logado e salva o token
      })
      //se deu erro, tira o token do localstorage (local onde ele ta sendo armazenado), pra nao deixar ele logar sem login
      .catch(error => {
        console.error("Falha na autenticação:", error);
        localStorage.removeItem('authToken');
        navigate('/');
      });
  }, [navigate]);

  //logout que vai ser chamado na sidebar, faz um request pra api deslogar o user e remove o token dele do localstorage
  const handleLogout = async () => {
    try {
      await apiClient.post('/logout');
    } finally {
      localStorage.removeItem('authToken'); //tira o token salvo
      navigate('/'); //volta pra pag de login
    }
  };

  // Função para abrir e fechar a sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app-container">
      {/* Container principal da aplicação */}
      <Sidebar isOpen={isSidebarOpen} user={user} onLogout={handleLogout} />
      <main className={`main-content ${isSidebarOpen ? "shifted" : ""}`}>
        <Navbar
          onHamburgerClick={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
        {/* Outlet renderiza as páginas e passa o 'user' para elas */}
        <Outlet context={{ user }} />
      </main>
    </div>
  );
}

/*hook que permite acessar o contexto do Outlet, que é o usuário logado, aqui temos a rota pai (mainlayout é o principal do site), e as outras paginas (rotas filhas) pegam 
esse contexto para usar o user*/
export function useUser() { //exporta uma funcao pra ser usada nas outras paginas
  return useOutletContext<{ user: User | null }>(); //permite que as paginas acessem o usuario logado, que como estipulado no useState(Funcao do react), pode ser nulo
}

export default MainLayout;