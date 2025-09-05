// IMPORTAÇÕES
import type { Event } from "../../../types";
import { exportPdf } from "../../../api/apiClient";
import { useUser } from "../../../hooks/useUser";

// PROPS DO COMPONENTE
interface EventModalProps {
  event: Event | null;
  onClose: () => void;
}

function EventModal({ event, onClose }: EventModalProps) {

  const { isAdmin } = useUser();

  if (!event) {
    return null;
  }
const handleExportClick = async () => {
  if (event && event.id) {
    await exportPdf(event.id);
  }
  else {
    alert("Evento não encontrado.");
  }
};


  return (
    <dialog id="event_modal" className="modal" open>
      <div className="modal-box">
        <h3 className="text-2xl font-bold">{event.tema}</h3>
        <p className="pt-4 pb-2"><strong>Palestrante:</strong> {event.palestrante}</p>
        <p className="py-2"><strong>Vagas Restantes:</strong> {event.vagas_max}</p>
        <p className="py-2"><strong>Local:</strong> {event.local}</p>
        <p className="py-2"><strong>Horário:</strong> {event.horario_inicio} - {event.horario_termino}</p>
        <p className="py-2"><strong>Descrição:</strong> {event.descricao}</p>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>Fechar</button>
          {isAdmin && (
          <button className="btn btn-primary" onClick={handleExportClick}>
              Gerar lista de presença
          </button>
          )}
        </div>
      </div>
    </dialog>
  );
}

export default EventModal;