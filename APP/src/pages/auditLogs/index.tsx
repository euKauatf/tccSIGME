import { useState, useEffect, useMemo } from "react";
import { getAuditLogs, clearAuditLogs } from "../../api/apiClient";
import type { AuditLog } from "../../types";

function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Estados para os filtros ---
  const [nameSearch, setNameSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [roundFilter, setRoundFilter] = useState("");

  const fetchLogs = () => {
    setIsLoading(true);
    getAuditLogs()
      .then(response => {
        setLogs(response.data.data || response.data); // Compatível com e sem paginação
      })
      .catch(err => {
        console.error("Erro ao carregar logs", err);
        setError("Não foi possível carregar os logs de auditoria.");
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleClearLogs = async () => {
    if (!window.confirm("ATENÇÃO!\n\nTem certeza que deseja apagar TODO o histórico de auditoria? Esta ação não pode ser desfeita.")) {
      return;
    }
    try {
      await clearAuditLogs();
      alert("Log de auditoria limpo com sucesso!");
      setLogs([]);
    } catch (err) {
      alert("Ocorreu um erro ao tentar limpar os logs.");
      console.error(err);
    }
  };

  // Calcula a rodada máxima existente nos logs para limitar o input
  const maxRound = useMemo(() => {
    return logs.reduce((max, log) => {
      const match = log.action.match(/na rodada (\d+)/);
      if (match) {
        const round = parseInt(match[1], 10);
        return round > max ? round : max;
      }
      return max;
    }, 1);
  }, [logs]);


  // Mapeia os status do filtro para as ações registadas no backend
  const statusToActionMap: { [key: string]: string[] } = {
    'inscrito': ['inscreveu-se'],
    'contemplado': ['foi contemplado'],
    'nao contemplado': ['foi nao contemplado', 'foi cancelado'],
    'presente': ['presenca marcada']
  };

  // Aplica os filtros aos logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Filtro por nome do aluno
      const nameMatch = !nameSearch || log.user?.name.toLowerCase().includes(nameSearch.toLowerCase());

      // CORRIGIDO: Filtro por status verifica se a ação do log CONTÉM a frase do status
      const statusMatch = statusFilter === 'todos' || 
        (statusToActionMap[statusFilter] && statusToActionMap[statusFilter].some(action => log.action.includes(action)));
      
      // CORRIGIDO: Lógica de filtro de rodada melhorada para ser exata
      const roundMatch = !roundFilter || (log.action.match(new RegExp(`na rodada ${roundFilter}(?![0-9])`)) !== null);

      return nameMatch && statusMatch && roundMatch;
    });
  }, [logs, nameSearch, statusFilter, roundFilter]);


  const formatAction = (action: string) => {
    // Simplesmente capitaliza a primeira letra para uma melhor apresentação
    return action.charAt(0).toUpperCase() + action.slice(1);
  };

  if (isLoading) {
    return <p className="text-center p-8 text-xl">Carregando logs de auditoria...</p>;
  }

  if (error) {
    return <p className="text-center p-8 text-xl text-red-500">{error}</p>;
  }

  return (
    <div className="main font-sans w-full p-4 flex flex-col items-center">
      <div className="w-full divp max-w-6xl flex justify-between items-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-emerald-800 py-3">
          Log de Auditoria
        </h1>
        <button onClick={handleClearLogs} className="btn btn-error btn-sm">
          Limpar Logs
        </button>
      </div>

      {/* --- Painel de Filtros --- */}
      <div className="w-full max-w-6xl mt-6 bg-white divp rounded-lg shadow-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Barra de Pesquisa por Nome */}
          <div>
            <label className="label">
              <span className="label-text">Pesquisar por nome</span>
            </label>
            <input
              type="text"
              placeholder="Digite o nome do aluno..."
              className="input input-bordered w-full"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
            />
          </div>
          {/* Filtro por Status */}
          <div>
            <label className="label">
              <span className="label-text">Filtrar por status</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="inscrito">Inscrito</option>
              <option value="contemplado">Contemplado</option>
              <option value="nao contemplado">Não Contemplado</option>
              <option value="presente">Presente</option>
            </select>
          </div>
          {/* Filtro por Rodada */}
          <div>
            <label className="label">
              <span className="label-text">Filtrar por rodada</span>
            </label>
            <input
              type="number"
              placeholder={`Nº da rodada (1 a ${maxRound})`}
              className="input input-bordered w-full"
              value={roundFilter}
              min="1" // Impede setas de irem abaixo de 1
              max={maxRound} // Impede setas de irem acima do máximo
              onChange={(e) => {
                // CORRIGIDO: Impede a inserção de valores negativos ou acima do limite
                const value = e.target.value;
                if (value === "" || (parseInt(value) >= 1 && parseInt(value) <= maxRound)) {
                  setRoundFilter(value);
                }
              }}
            />
          </div>
        </div>
      </div>


      <div className="w-full max-w-6xl mt-6">
        <div className="bg-white divp rounded-lg shadow-lg p-4 md:p-6">
          {filteredLogs.length > 0 ? (
            <ul className="space-y-3">
              {filteredLogs.map((log) => (
                <li key={log.id} className="p-3 bg-gray-50 divp rounded-md border border-gray-200">
                  <p>
                    <span className="font-bold text-emerald-600">{log.user?.name || 'Utilizador Apagado'}</span>
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
            <p className="text-center text-gray-500 py-10">Nenhum registo encontrado com os filtros aplicados.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuditLogPage;