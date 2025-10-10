import React, { useState } from "react";
import { updatePassword } from "../../api/apiClient";

const RedefinirSenha: React.FC = () => {
  const [matricula, setMatricula] = useState("");
  const [senhaAntiga, setSenhaAntiga] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setMensagem("");

    if (novaSenha !== confirmarSenha) {
      setErro("A nova senha e a confirmação precisam ser iguais.");
      return;
    }

    try {
      const response = await updatePassword({
        matricula,
        senha_antiga: senhaAntiga,
        nova_senha: novaSenha,
      });

      if (response.status === 200) {
        setMensagem("Senha atualizada com sucesso!");
        setMatricula("");
        setSenhaAntiga("");
        setNovaSenha("");
        setConfirmarSenha("");
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        setErro(error.response.data.message || "Erro ao redefinir senha.");
      } else {
        setErro("Erro inesperado ao tentar redefinir senha.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Redefinir Senha</h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Matrícula
          </label>
          <input
            type="text"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Senha antiga
          </label>
          <input
            type="password"
            value={senhaAntiga}
            onChange={(e) => setSenhaAntiga(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Nova senha
          </label>
          <input
            type="password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Confirmar nova senha
          </label>
          <input
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {erro && <p className="text-red-500 text-sm mb-2">{erro}</p>}
        {mensagem && <p className="text-green-600 text-sm mb-2">{mensagem}</p>}

        <button
          type="submit"
          className="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-green-700 transition-all"
        >
          Atualizar Senha
        </button>
      </form>
    </div>
  );
};

export default RedefinirSenha;
