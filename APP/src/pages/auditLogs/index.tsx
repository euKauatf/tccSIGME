import { useState, useEffect } from "react";
import { getAuditLogs, clearAuditLogs } from "../../api/apiClient";
import type { AuditLog } from "../../types";

function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar os logs da API
  const fetchLogs = () => {
    setIsLoading(true);
    getAuditLogs()
      .then(response => {
        // A API com paginação do Laravel retorna os dados dentro de um objeto 'data'
        setLogs(response.data.data);
      })
      .catch(err => {
        console.error("Erro ao carregar logs", err);
        setError("Não foi possível carregar os logs de auditoria.");
      })
      .finally(() => setIsLoading(false));
  };

  // Roda a busca de logs quando o componente é montado
  useEffect(() => {
    fetchLogs();
  }, []);

  // Função para lidar com o clique no botão de limpar logs
  const handleClearLogs = async () => {
    // Pede confirmação antes de executar uma ação destrutiva
    if (!window.confirm("ATENÇÃO!\n\nTem certeza que deseja apagar TODO o histórico de auditoria? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      await clearAuditLogs();
      alert("Log de auditoria limpo com sucesso!");
      setLogs([]); // Limpa a lista na tela imediatamente
    } catch (err) {
      alert("Ocorreu um erro ao tentar limpar os logs.");
      console.error(err);
    }
  };

  // Função para traduzir a 'action' para um texto legível
  const formatAction = (action: string) => {
    const actions: { [key: string]: string } = {
      'inscricao_realizada': 'Realizou Inscrição',
      'inscricao_cancelada': 'Cancelou Inscrição'
      // Adicione outras traduções de ações aqui no futuro
    };
    return actions[action] || action;
  };

  if (isLoading) {
    return <p className="text-center p-8 text-xl">Carregando logs de auditoria...</p>;
  }

  if (error) {
    return <p className="text-center p-8 text-xl text-red-500">{error}</p>;
  }

  return (
    <div className="main font-sans w-full p-4 flex flex-col items-center">
      <div className="w-full divp max-w-5xl flex justify-between items-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-emerald-800 py-3">
          Log de Auditoria
        </h1>
        <button onClick={handleClearLogs} className="btn btn-error btn-sm">
          Limpar Logs
        </button>
      </div>

      <div className="w-full max-w-5xl mt-6">
        <div className="bg-white divp rounded-lg shadow-lg p-4 md:p-6">
          {logs.length > 0 ? (
            <ul className="space-y-3">
              {logs.map((log) => (
                <li key={log.id} className="p-3 bg-gray-50 divp rounded-md border border-gray-200">
                  <p>
                    <span className="font-bold text-emerald-600">{log.user?.name || 'Usuário Deletado'}</span>
                    <span className="text-gray-700"> {formatAction(log.action)} </span>
                    {log.auditable && (
                      <span className="text-gray-700">
                        no evento <span className="font-bold">{log.auditable.tema}</span>
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(log.created_at).toLocaleString('pt-BR')}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 py-10">Nenhum registro de auditoria encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuditLogPage;