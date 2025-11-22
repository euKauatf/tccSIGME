import React, { useState } from "react";
import { updatePassword } from "../../api/apiClient";

const RedefinirSenha: React.FC = () => {
  const [matricula, setMatricula] = useState("");
  const [senhaAntiga, setSenhaAntiga] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  type FlashState = {
    message: string;
    status: "success" | "error";
  } | null;

  const [flash, setFlash] = useState<FlashState>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFlash(null);

    if (novaSenha !== confirmarSenha) {
      setFlash({
        message: "A nova senha e a confirmação precisam ser iguais.",
        status: "error",
      });
      return;
    }

    try {
      const response = await updatePassword({
        matricula,
        senha_antiga: senhaAntiga,
        nova_senha: novaSenha,
      });

      if (response.status === 200) {
        setFlash({
          message: "Senha atualizada com sucesso!",
          status: "success",
        });
        setMatricula("");
        setSenhaAntiga("");
        setNovaSenha("");
        setConfirmarSenha("");
      }
    } catch (error: any) {
      let errorMessage = "Erro inesperado ao tentar redefinir senha.";
      if (error.response && error.response.data) {
        errorMessage =
          error.response.data.message || "Erro ao redefinir senha.";
      }
      setFlash({ message: errorMessage, status: "error" });
    }
  };

  const getAlertClasses = () => {
    if (flash?.status === "success") {
      return "alert-success";
    }
    return "alert-error";
  };

  const SuccessIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 stroke-current shrink-0"
      fill="none"
      viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  const ErrorIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 stroke-current shrink-0"
      fill="none"
      viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  return (
    <div className="flex items-center justify-center min-h-screen divp">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 shadow-md rounded-2xl">
        <h2 className="mb-6 text-2xl font-bold text-center">Redefinir Senha</h2>

        {flash && (
          <div role="alert" className={`mb-4 alert ${getAlertClasses()}`}>
            {flash.status === "success" ? <SuccessIcon /> : <ErrorIcon />}
            <span className="font-semibold">{flash.message}</span>
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">
            Matrícula
          </label>
          <input
            type="text"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">
            Senha antiga
          </label>
          <input
            type="password"
            value={senhaAntiga}
            onChange={(e) => setSenhaAntiga(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">
            Nova senha
          </label>
          <input
            type="password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">
            Confirmar nova senha
          </label>
          <input
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 text-white transition-all rounded-lg btn btn-success">
          Atualizar Senha
        </button>
      </form>
    </div>
  );
};

export default RedefinirSenha;
