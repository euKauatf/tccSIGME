import { useEffect } from "react";

type ModalStatus = "success" | "error" | "info";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  status?: ModalStatus;
}

const statusStyles = {
  success: {
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    colorClass: "text-success",
  },
  error: {
    icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
    colorClass: "text-error",
  },
  info: {
    icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    colorClass: "text-info",
  },
};

function InfoModal({
  isOpen,
  onClose,
  title,
  message,
  status = "info",
}: InfoModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const { icon, colorClass } = statusStyles[status];

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50"
      onClick={onClose}>
      <div
        className="relative w-full max-w-md p-6 mx-4 rounded-lg shadow-xl bg-base-100"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`stroke-current shrink-0 h-8 w-8 ${colorClass}`}
            fill="none"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={icon}
            />
          </svg>

          <div>
            <h2 className={`text-xl font-bold mb-2 text-base-content`}>
              {title}
            </h2>
            <p className="text-base-content text-opacity-80">{message}</p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button onClick={onClose} className="btn btn-primary">
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}

export default InfoModal;
