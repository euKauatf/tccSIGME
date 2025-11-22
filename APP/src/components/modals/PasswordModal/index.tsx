import "./style.css";
import { useState, useEffect, type KeyboardEvent } from "react";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  title: string;
  message: string;
}

function PasswordModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: PasswordModalProps) {
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setPassword("");
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleConfirmClick = () => {
    onConfirm(password);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleConfirmClick();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50"
      onClick={onClose}>
      <div
        className="relative w-full max-w-md p-6 mx-4 rounded-lg shadow-xl bg-base-100"
        onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-4 text-xl font-bold text-base-content">{title}</h2>
        <p className="mb-5 text-gray-600">{message}</p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full mb-6 input input-bordered"
          placeholder="Digite sua senha"
          autoFocus
        />

        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="btn btn-ghost">
            Cancelar
          </button>
          <button onClick={handleConfirmClick} className="btn btn-error">
            Confirmar Ação
          </button>
        </div>
      </div>
    </div>
  );
}

export default PasswordModal;
