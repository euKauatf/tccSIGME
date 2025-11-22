import { useState, useEffect, useMemo } from "react";
import type { User } from "../../types";
import { getAlunos } from "../../api/apiClient";
import "./style.css";

function StudentsPage() {
  const [students, setStudents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nameSearch, setNameSearch] = useState("");

  const [expandedStudentId, setExpandedStudentId] = useState<number | null>(
    null
  );

  const filteredStudents = useMemo(() => {
    if (!nameSearch) {
      return students;
    }
    return students.filter((student) =>
      student.name.toLowerCase().includes(nameSearch.toLowerCase())
    );
  }, [students, nameSearch]);

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
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

  const handleToggleEvents = (studentId: number) => {
    if (expandedStudentId === studentId) {
      setExpandedStudentId(null);
    } else {
      setExpandedStudentId(studentId);
    }
  };

  if (isLoading) {
    return (
      <p className="p-8 text-xl text-center">Carregando lista de alunos...</p>
    );
  }

  if (error) {
    return <p className="p-8 text-xl text-center text-red-500">{error}</p>;
  }

  return (
    <div className="flex flex-col items-center w-full p-4 font-sans main">
      <h1 className="py-3 text-5xl font-bold text-center text-emerald-800">
        Alunos Registrados
      </h1>

      <div className="w-full max-w-4xl mt-6">
        <div className="flex flex-col divp rounded-[20px] p-6 bg-emerald-50 shadow-lg">
          <h2 className="py-3 text-3xl text-center md:text-4xl text-emerald-600">
            Lista de Alunos
          </h2>
          <input
            type="text"
            placeholder="Digite o nome do aluno..."
            className="w-1/2 mx-auto my-4 input input-bordered"
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
          />

          {students.length > 0 ? (
            <ul className="flex flex-col pb-6 gap-y-2">
              {filteredStudents.map((student) => (
                <li
                  key={student.id}
                  className="transition-shadow bg-white rounded-lg shadow-md divp hover:shadow-lg">
                  <div className="flex flex-col items-center justify-between p-4 sm:flex-row">
                    <div>
                      <p className="text-lg font-bold text-gray-800">
                        {student.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Matrícula:</strong> {student.matricula}
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <button
                        onClick={() => handleToggleEvents(student.id)}
                        className="text-white btn btn-sm bg-emerald-500 hover:bg-emerald-600">
                        {expandedStudentId === student.id
                          ? "Ocultar Palestras"
                          : "Ver Palestras"}
                      </button>
                    </div>
                  </div>

                  {expandedStudentId === student.id && (
                    <div className="px-4 pt-2 pb-4 border-t">
                      <h4 className="mb-2 font-bold text-emerald-700">
                        Palestras Inscritas:
                      </h4>
                      {student.eventos && student.eventos.length > 0 ? (
                        <ul className="space-y-2">
                          {student.eventos.map((event) => (
                            <li
                              key={event.id}
                              className="p-2 text-sm text-gray-800 rounded-md">
                              {event.tema}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">
                          Este aluno não está inscrito em nenhuma palestra.
                        </p>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-8 text-center text-gray-500">
              Nenhum aluno encontrado.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentsPage;
