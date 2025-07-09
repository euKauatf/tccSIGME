// import { useUser } from "../../hooks/useUser"; // Importa o hook que criamos no MainLayout
import "./style.css";

function EventsPage() {
    //const { user } = useUser();

    return (
        // -=-=-=-=-=-=-=-=-=-=-=- Divisão principal do site -=-=-=-=-=-=-=-=-=--=-=-=-=-=-
        <div className="main font-sans flex flex-col items-center justify-center">
            {/* -=-=-=-=-=-=-=-=-=-=-=- Texto do topo do site -=-=-=-=-=-=-=-=-=-=-=- */}
            <h1 className="text-5xl font-bold text-center text-emerald-800 py-3">
                Eventos Registrados
            </h1>
            {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */}

            {/* -=-=-=-=-=-=-=-=-=-=-=- Div para a lista de eventos -=-=-=-=-=-=-=-=-=--=-=-=-=-=- */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col glass rounded-[20px] min-h-[170px] mb-30 px-6 bg-emerald-50">
                    {/* -=-=-=-=-=-=-=-=-=-=-=- Titulo da div -=-=-=-=-=-=-=-=-=-=-=- */}
                    <h2 className="text-[36px] text-emerald-600 py-3 text-center">
                        Lista de Eventos
                    </h2>
                    {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */}

                    {/* -=-=-=-=-=-=-=-=-=-=-=- Lista de eventos -=-=-=-=-=-=-=-=-=--=-=-=-=-=- */}
                    <ul className="flex flex-col gap-y-[1px] pb-6">     

                        <li className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                            <span className="font-bold text-gray-800">Evento 1</span>
                            <div className="flex gap-x-1 pl-30">
                                <button className="btn btn-warning">Modificar</button>
                                <button className="btn btn-error">Excluir</button>
                            </div>
                        </li>

                        <li className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                            <span className="font-bold text-gray-800">Evento 2</span>
                            <div className="flex gap-x-1 pl-30">
                                <button className="btn btn-warning">Modificar</button>
                                <button className="btn btn-error">Excluir</button>
                            </div>
                        </li>
                        
                        <li className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                            <span className="font-bold text-gray-800">Evento 3</span>
                            <div className="flex gap-x-1 pl-30">
                                <button className="btn btn-warning">Modificar</button>
                                <button className="btn btn-error">Excluir</button>
                            </div>
                        </li>

                        <li className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                            <span className="font-bold text-gray-800">Evento 4</span>
                            <div className="flex gap-x-1 pl-30">
                                <button className="btn btn-warning">Modificar</button>
                                <button className="btn btn-error">Excluir</button>
                            </div>
                        </li>
                    </ul>

                    <button className="btn btn-active btn-info mb-6">Adicionar Evento</button>
                    {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */}
                </div>
                {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */}
            </div>
            {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */}
        </div>
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    );
}

export default EventsPage;