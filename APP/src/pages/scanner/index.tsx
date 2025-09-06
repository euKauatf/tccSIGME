import { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import type { Event } from "../../types";
import { getEvents, marcarPresenca } from "../../api/apiClient";

const QR_READER_CONTAINER_ID = "qr-reader-container";

function ScannerPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [searchTerm, setSearchTerm] = useState(""); // Estado para a barra de pesquisa
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [lastResult, setLastResult] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [isScannerActive, setScannerActive] = useState(false);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    // Busca todos os eventos
    useEffect(() => {
        getEvents().then(response => setEvents(response.data)).catch(() => {
            setMessage({ type: 'error', text: 'Não foi possível carregar os eventos.' });
        });
    }, []);

    // Efeito para controlar o scanner
    useEffect(() => {
        if (isScannerActive && !scannerRef.current) {
            const scanner = new Html5QrcodeScanner(
                QR_READER_CONTAINER_ID,
                { fps: 10, qrbox: { width: 250, height: 250 } },
                false
            );

            const onScanSuccess = (decodedText: string) => {
                handleScanResult(decodedText);
            };

            scanner.render(onScanSuccess, undefined);
            scannerRef.current = scanner;
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => {
                    console.error("Falha ao limpar o scanner.", error);
                });
                scannerRef.current = null;
            }
        };
    }, [isScannerActive]);

    const handleScanResult = async (matricula: string) => {
        if (matricula === lastResult) return;
        setLastResult(matricula);

        if (selectedEventId) {
            try {
                const response = await marcarPresenca(matricula, selectedEventId);
                setMessage({ type: 'success', text: response.data.message });
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || 'Erro ao registar presença.';
                setMessage({ type: 'error', text: errorMessage });
            } finally {
                setTimeout(() => {
                    setMessage(null);
                    setLastResult(null);
                }, 3000);
            }
        }
    };

    const handleStartScanner = () => {
        if (!selectedEventId) {
            setMessage({ type: 'error', text: 'Por favor, selecione um evento antes de iniciar o scanner.' });
            return;
        }
        setMessage(null);
        setLastResult(null);
        setScannerActive(true);
    };

    const handleStopScanner = () => {
        setScannerActive(false);
    };

    // Filtra os eventos com base no termo de pesquisa
    const filteredEvents = events.filter(event =>
        event.tema.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col items-center w-full p-4 font-sans main">
            <h1 className="py-3 text-5xl font-bold text-center text-emerald-800">Scanner de Presença</h1>

            <div className="w-full max-w-lg mt-6 bg-white divp rounded-lg shadow-lg p-6">
                {/* Componente de pesquisa e seleção de evento mesclado */}
                <div className="mb-4">
                    <label htmlFor="event-search" className="block text-lg font-medium text-gray-700 mb-2">
                        Pesquisar e Selecionar Evento:
                    </label>
                    <div className="dropdown dropdown-bottom w-full">
                        <input
                            id="event-search"
                            type="text"
                            placeholder="Clique ou digite para pesquisar..."
                            className="input input-bordered w-full"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                // Limpa a seleção se o utilizador começar a digitar novamente
                                if (selectedEventId !== null) {
                                    setSelectedEventId(null);
                                }
                            }}
                            tabIndex={0}
                            disabled={isScannerActive}
                        />
                        {/* A lista suspensa agora é controlada pelo foco no input (padrão do DaisyUI) */}
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full mt-1 max-h-60 overflow-y-auto">
                            {filteredEvents.length > 0 ? (
                                filteredEvents.map(event => (
                                    <li key={event.id}>
                                        <a onClick={() => {
                                            setSelectedEventId(event.id);
                                            // Preenche o input com o evento selecionado
                                            setSearchTerm(`${event.tema} (${event.data})`);
                                            // Truque para fechar a lista suspensa
                                            (document.activeElement as HTMLElement)?.blur();
                                        }}>
                                            {event.tema} ({event.data} - {event.horario_inicio})
                                        </a>
                                    </li>
                                ))
                            ) : (
                                <li className="p-2 text-gray-500">Nenhum evento encontrado.</li>
                            )}
                        </ul>
                    </div>
                </div>


                {!isScannerActive ? (
                    <button onClick={handleStartScanner} className="w-full btn btn-success" disabled={!selectedEventId}>
                        Iniciar Scanner
                    </button>
                ) : (
                    <div className="p-4 mt-4 border-2 border-dashed rounded-lg border-gray-300">
                        <div id={QR_READER_CONTAINER_ID} />
                        <button onClick={handleStopScanner} className="w-full mt-4 btn btn-ghost">
                            Parar Scanner
                        </button>
                    </div>
                )}

                <div className="mt-4 text-center h-8">
                    {message && (
                        <p className={`font-bold ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {message.text}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ScannerPage;

