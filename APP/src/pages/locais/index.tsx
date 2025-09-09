import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLocais, deleteLocal } from '../../api/apiClient';
import type { Local } from '../../types';
import { useUser } from '../../hooks/useUser';

function LocaisPage() {
  const [locais, setLocais] = useState<Local[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAdmin } = useUser();

  // Função para buscar os dados dos locais.
  const fetchLocais = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getLocais();
      setLocais(response.data);
      setError(null);
    } catch (err) {
      console.error("Erro ao carregar locais:", err);
      setError("Não foi possível carregar a lista de locais.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Busca os dados uma vez ao carregar o componente.
  useEffect(() => {
    fetchLocais();
  }, [fetchLocais]);

  const handleAdd = () => {
    navigate('/locais/add');
  };

  const handleEdit = (id: number) => {
    navigate(`/locais/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza de que deseja excluir este local?')) {
      try {
        await deleteLocal(id);
        alert('Local excluído com sucesso!');
        fetchLocais(); // Atualiza a lista após a exclusão.
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Ocorreu um erro ao excluir.';
        alert(`Não foi possível excluir: ${errorMsg}`);
      }
    }
  };

  // Renderiza o estado de carregamento.
  if (isLoading) {
    return <p className="p-8 text-center">A carregar locais...</p>;
  }

  // Renderiza o estado de erro.
  if (error) {
    return <p className="p-8 text-center text-red-500">{error}</p>;
  }

  // Se o usuário não for administrador, mostre apenas a mensagem.
  // Você pode ajustar este comportamento caso a rota já esteja protegida.
  if (!isAdmin) {
    return <p className="p-8 text-center">Você não tem permissão para visualizar esta página.</p>;
  }

  // Renderiza a página principal com o estilo solicitado.
  return (
    <div className="flex flex-col items-center w-full min-h-screen p-4 font-sans main sm:p-6 lg:p-8">
      <div className="flex items-center justify-between w-full max-w-4xl mb-8">
        <h1 className="text-5xl font-bold text-emerald-800">
          Administrar Locais
        </h1>
        {isAdmin && (
          <button onClick={handleAdd} className="btn btn-success">
            Adicionar Local
          </button>
        )}
      </div>

      <div className="w-full max-w-4xl">
        <div className="flex flex-col divp rounded-[20px] p-6 bg-emerald-50 shadow-lg">
          <h2 className="py-3 text-3xl text-center md:text-4xl text-emerald-600">
            Lista de Locais
          </h2>

          {locais.length > 0 ? (
            <ul className="flex flex-col pb-6 gap-y-2">
              {locais.map((local) => (
                <li key={local.id} className="transition-shadow bg-white rounded-lg shadow-md divp hover:shadow-lg">
                  <div className="flex flex-col items-start justify-between p-4 sm:flex-row sm:items-center">
                    <div className="flex-grow">
                      <p className="text-lg font-bold text-gray-800">{local.name}</p>
                      <p className="text-sm text-gray-600">
                        <strong>Capacidade:</strong> {local.capacidade}
                      </p>
                    </div>
                    {isAdmin && (
                      <div className="flex self-end gap-2 mt-4 sm:self-center sm:mt-0">
                        <button onClick={() => handleEdit(local.id)} className="btn btn-sm btn-success">Modificar</button>
                        <button onClick={() => handleDelete(local.id)} className="btn btn-sm btn-error">Excluir</button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-8 text-center text-gray-500">Nenhum local registrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LocaisPage;