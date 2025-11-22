import { useState, useEffect, useMemo } from "react";
import { getAuditLogs, clearAuditLogs } from "../../api/apiClient";
import type { AuditLog } from "../../types";

function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [nameSearch, setNameSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [roundFilter, setRoundFilter] = useState("");

  const fetchLogs = () => {
    setIsLoading(true);
    getAuditLogs()
      .then((response) => {
        setLogs(response.data.data || response.data);
      })
      .catch((err) => {
        console.error("Erro ao carregar logs", err);
        setError("Não foi possível carregar os logs de auditoria.");
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleClearLogs = async () => {
    if (
      !window.confirm(
        "ATENÇÃO!\n\nTem certeza que deseja apagar TODO o histórico de auditoria? Esta ação não pode ser desfeita."
      )
    ) {
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

  const statusToActionMap: { [key: string]: string[] } = {
    inscrito: ["inscreveu-se"],
    contemplado: ["foi contemplado"],
    "nao contemplado": ["foi nao contemplado", "foi cancelado"],
    presente: ["presenca marcada"],
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const nameMatch =
        !nameSearch ||
        log.user?.name.toLowerCase().includes(nameSearch.toLowerCase());

      const statusMatch =
        statusFilter === "todos" ||
        (statusToActionMap[statusFilter] &&
          statusToActionMap[statusFilter].some((action) =>
            log.action.includes(action)
          ));

      const roundMatch =
        !roundFilter ||
        log.action.match(new RegExp(`na rodada ${roundFilter}(?![0-9])`)) !==
          null;

      return nameMatch && statusMatch && roundMatch;
    });
  }, [logs, nameSearch, statusFilter, roundFilter]);

  const formatAction = (action: string) => {
    return action.charAt(0).toUpperCase() + action.slice(1);
  };

  if (isLoading) {
    return (
      <p className="p-8 text-xl text-center">Carregando logs de auditoria...</p>
    );
  }

  if (error) {
    return <p className="p-8 text-xl text-center text-red-500">{error}</p>;
  }

  return (
    <div className="flex flex-col items-center w-full p-4 font-sans main">
      <div className="flex items-center justify-between w-full max-w-6xl px-4 divp">
        <h1 className="py-3 text-4xl font-bold text-center md:text-5xl text-emerald-800">
          Log de Auditoria
        </h1>
        <button onClick={handleClearLogs} className="btn btn-error btn-sm">
          Limpar Logs
        </button>
      </div>

      <div className="w-full max-w-6xl p-4 mt-6 bg-white rounded-lg shadow-lg divp">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="label">
              <span className="label-text">Pesquisar por nome</span>
            </label>
            <input
              type="text"
              placeholder="Digite o nome do aluno..."
              className="w-full input input-bordered"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Filtrar por status</span>
            </label>
            <select
              className="w-full select select-bordered"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="todos">Todos</option>
              <option value="inscrito">Inscrito</option>
              <option value="contemplado">Contemplado</option>
              <option value="nao contemplado">Não Contemplado</option>
              <option value="presente">Presente</option>
            </select>
          </div>
          <div>
            <label className="label">
              <span className="label-text">Filtrar por rodada</span>
            </label>
            <input
              type="number"
              placeholder={`Nº da rodada (1 a ${maxRound})`}
              className="w-full input input-bordered"
              value={roundFilter}
              min="1"
              max={maxRound}
              onChange={(e) => {
                const value = e.target.value;
                if (
                  value === "" ||
                  (parseInt(value) >= 1 && parseInt(value) <= maxRound)
                ) {
                  setRoundFilter(value);
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl mt-6">
        <div className="p-4 bg-white rounded-lg shadow-lg divp md:p-6">
          {filteredLogs.length > 0 ? (
            <ul className="space-y-3">
              {filteredLogs.map((log) => (
                <li
                  key={log.id}
                  className="p-3 border border-gray-200 rounded-md bg-gray-50 divp">
                  <p>
                    <span className="font-bold text-emerald-600">
                      {log.user?.name || "Utilizador Apagado"}
                    </span>
                    <span className="text-gray-700">
                      {" "}
                      {formatAction(log.action)}{" "}
                    </span>
                    {log.auditable && (
                      <span className="text-gray-700">
                        no evento{" "}
                        <span className="font-bold">{log.auditable.tema}</span>
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(log.created_at).toLocaleString("pt-BR")}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-10 text-center text-gray-500">
              Nenhum registo encontrado com os filtros aplicados.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuditLogPage;
