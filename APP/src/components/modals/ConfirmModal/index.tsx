import { useEffect } from 'react';

type ButtonType = 'btn-primary' | 'btn-secondary' | 'btn-success' | 'btn-error' | 'btn-info';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText?: string;
  confirmButtonType?: ButtonType;
}

function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmButtonText = 'Confirmar', confirmButtonType = 'btn-primary' }: ConfirmModalProps) {
  // Efeito para bloquear o scroll do body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="relative w-full max-w-md p-6 mx-4 rounded-lg shadow-xl bg-base-100" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-4 text-xl font-bold text-base-content">{title}</h2>
        <p className="mb-5 text-base-content text-opacity-80">{message}</p>

        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="btn btn-ghost">
            Cancelar
          </button>
          <button onClick={onConfirm} className={`btn ${confirmButtonType}`}>
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;