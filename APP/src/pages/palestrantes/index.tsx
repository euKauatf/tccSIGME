import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPalestrantes, deletePalestrante } from '../../api/apiClient';
import type { Palestrante } from '../../types';
import { useUser } from '../../hooks/useUser';

function PalestrantesPage() {
  const [palestrantes, setPalestrantes] = useState<Palestrante[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAdmin } = useUser();

  // Função centralizada para buscar os dados de forma segura.
  const fetchPalestrantes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getPalestrantes();
      setPalestrantes(response.data);
      setError(null);
    } catch (err) {
      console.error("Erro ao carregar palestrantes:", err);
      setError("Não foi possível carregar a lista de palestrantes.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Busca os dados apenas uma vez, quando o componente é montado.
  useEffect(() => {
    fetchPalestrantes();
  }, [fetchPalestrantes]);

  // Funções para navegar para as páginas de adicionar e editar.
  const handleAdd = () => {
    navigate('/palestrantes/add');
  };

  const handleEdit = (id: number) => {
    navigate(`/palestrantes/edit/${id}`);
  };

  // Função para excluir um palestrante, com confirmação e atualização da lista.
  const handleDelete = async (id: number) => {
    if (window.confirm('Tem a certeza de que deseja excluir este palestrante?')) {
      try {
        await deletePalestrante(id);
        alert('Palestrante excluído com sucesso!');
        fetchPalestrantes(); // Re-busca os dados para atualizar a lista.
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Ocorreu um erro ao excluir.';
        alert(`Não foi possível excluir: ${errorMsg}`);
      }
    }
  };

  // Renderiza o estado de carregamento.
  if (isLoading) {
    return <p className="p-8 text-center">A carregar palestrantes...</p>;
  }

  // Renderiza o estado de erro.
  if (error) {
    return <p className="p-8 text-center text-red-500">{error}</p>;
  }

  // Renderiza a página principal com o estilo solicitado.
  return (
    <div className="flex flex-col items-center w-full min-h-screen p-4 font-sans main sm:p-6 lg:p-8">
      <div className="flex items-center justify-between w-full max-w-4xl mb-8">
        <h1 className="text-5xl font-bold text-emerald-800">
          Gerir Palestrantes
        </h1>
        {isAdmin && (
          <button onClick={handleAdd} className="btn btn-success"> {/* ✅ ALTERADO: Cor do botão de 'primary' para 'success' (verde) */}
            Adicionar Palestrante
          </button>
        )}
      </div>

      <div className="w-full max-w-4xl">
        <div className="flex flex-col divp rounded-[20px] p-6 bg-emerald-50 shadow-lg">
          <h2 className="py-3 text-3xl text-center md:text-4xl text-emerald-600">
            Lista de Palestrantes
          </h2>

          {palestrantes.length > 0 ? (
            <ul className="flex flex-col pb-6 gap-y-2">
              {palestrantes.map((palestrante) => (
                <li key={palestrante.id} className="transition-shadow bg-white rounded-lg shadow-md divp hover:shadow-lg">
                  <div className="flex flex-col items-start justify-between p-4 sm:flex-row sm:items-center">
                    <div className="flex-grow">
                      <p className="text-lg font-bold text-gray-800">{palestrante.name}</p>
                      <p className="text-sm text-gray-600">
                        <strong>Email:</strong> {palestrante.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Telefone:</strong> {palestrante.telefone}
                      </p>
                    </div>
                    {isAdmin && (
                      <div className="flex self-end gap-2 mt-4 sm:self-center sm:mt-0">
                        <button onClick={() => handleEdit(palestrante.id)} className="btn btn-sm btn-success">Modificar</button>
                        <button onClick={() => handleDelete(palestrante.id)} className="btn btn-sm btn-error">Excluir</button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-8 text-center text-gray-500">Nenhum palestrante registado.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PalestrantesPage;