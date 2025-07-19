
import { useState, useEffect } from "react";
import type { User } from "../../types";
import { getAlunos } from "../../api/apiClient";
import "./style.css";

function StudentsPage() {
  const [students, setStudents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <div className="flex flex-col glass rounded-[20px] p-6 bg-emerald-50 shadow-lg">
          <h2 className="text-3xl md:text-4xl text-emerald-600 py-3 text-center">
            Lista de Alunos
          </h2>

          {students.length > 0 ? (
            <ul className="flex flex-col gap-y-3 pb-6">
              {students.map((student) => (
                <li key={student.id} className="p-4 bg-white rounded-lg shadow-md">
                  <div>
                    <p className="font-bold text-lg text-gray-800">{student.name}</p>
                    <p className="text-sm text-gray-600">
                      <strong>Matrícula:</strong> {student.matricula}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Email:</strong> {student.email}
                    </p>
                  </div>
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