// Em: src/pages/StudentsPage/index.jsx

import { useState, useEffect } from "react";
import type { User } from "../../types";
import { getAlunos } from "../../api/apiClient";
import "./style.css";

function StudentsPage() {
  const [students, setStudents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado que controla qual painel de aluno está aberto
  const [expandedStudentId, setExpandedStudentId] = useState<number | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        // Esta função deve buscar os alunos com seus eventos relacionados
        const response = await getAlunos();
        setStudents(response.data);
      } catch (err) {
        console.error("Erro ao buscar alunos:", err);
        setError("Não foi possível carregar a lista de alunos.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // Função para abrir ou fechar o painel de eventos de um aluno
  const handleToggleEvents = (studentId: number) => {
    if (expandedStudentId === studentId) {
      setExpandedStudentId(null); // Fecha se já estiver aberto
    } else {
      setExpandedStudentId(studentId); // Abre o painel do aluno clicado
    }
  };

  if (isLoading) {
    return <p className="text-center text-xl p-8">Carregando lista de alunos...</p>;
  }

  if (error) {
    return <p className="text-center text-xl p-8 text-red-500">{error}</p>;
  }

  return (
    <div className="main font-sans w-full p-4 flex flex-col items-center">
      <h1 className="text-5xl font-bold text-center text-emerald-800 py-3">
        Alunos Registrados
      </h1>

      <div className="w-full max-w-4xl mt-6">
        <div className="flex flex-col divp rounded-[20px] p-6 bg-emerald-50 shadow-lg">
          <h2 className="text-3xl md:text-4xl text-emerald-600 py-3 text-center">
            Lista de Alunos
          </h2>

          {students.length > 0 ? (
            <ul className="flex flex-col gap-y-2 pb-6">
              {students.map((student) => (
                <li key={student.id} className="bg-white divp rounded-lg shadow-md transition-shadow hover:shadow-lg">
                  {/* --- Informações principais do aluno --- */}
                  <div className="flex flex-col sm:flex-row items-center justify-between p-4">
                    <div>
                      <p className="font-bold text-lg text-gray-800">{student.name}</p>
                      <p className="text-sm text-gray-600">
                        <strong>Matrícula:</strong> {student.matricula}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Email:</strong> {student.email}
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <button
                        onClick={() => handleToggleEvents(student.id)}
                        className="btn btn-sm bg-emerald-500 hover:bg-emerald-600 text-white"
                      >
                        {expandedStudentId === student.id ? "Ocultar Palestras" : "Ver Palestras"}
                      </button>
                    </div>
                  </div>

                  {/* --- Painel expansível com as palestras --- */}
                  {expandedStudentId === student.id && (
                    <div className="px-4 pb-4 pt-2 border-t border-gray-200">
                      <h4 className="font-bold text-emerald-700 mb-2">Palestras Inscritas:</h4>
                      {student.eventos && student.eventos.length > 0 ? (
                        <ul className="space-y-2">
                          {student.eventos.map(event => (
                            <li key={event.id} className="p-2 bg-emerald-50 rounded-md text-sm text-gray-800">
                              {event.tema}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-sm">Este aluno não está inscrito em nenhuma palestra.</p>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 py-8">Nenhum aluno encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentsPage;