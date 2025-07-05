import "./style.css";

function StudentsPage() {
    return (
        // -=-=-=-=-=-=-=-=-=-=-=- Divisão principal do site -=-=-=-=-=-=-=-=-=--=-=-=-=-=-
        <div className="main font-sans flex flex-col items-center justify-center">
            {/* -=-=-=-=-=-=-=-=-=-=-=- Texto do topo do site -=-=-=-=-=-=-=-=-=-=-=- */}
            <h1 className="text-5xl font-bold text-center text-emerald-800 py-3">
                Alunos Registrados
            </h1>
            {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */}

            {/* -=-=-=-=-=-=-=-=-=-=-=- Div para a lista de alunos -=-=-=-=-=-=-=-=-=--=-=-=-=-=- */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col glass rounded-[20px] min-h-[170px] mb-30 px-6 bg-emerald-50">
                    {/* -=-=-=-=-=-=-=-=-=-=-=- Titulo da div -=-=-=-=-=-=-=-=-=-=-=- */}
                    <h2 className="text-[36px] text-emerald-600 py-3 text-center">
                        Lista de Alunos
                    </h2>
                    {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */}

                    {/* -=-=-=-=-=-=-=-=-=-=-=- Lista de alunos -=-=-=-=-=-=-=-=-=--=-=-=-=-=- */}
                    <ul className="flex flex-col gap-y-[1px] pb-6">     

                        <li className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                            <span className="font-bold text-gray-800">Aluno 1</span>
                            <div className="flex gap-x-1 pl-30">
                                <button className="btn btn-warning">Modificar</button>
                                <button className="btn btn-error">Error</button>
                            </div>
                        </li>

                        <li className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                            <span className="font-bold text-gray-800">Aluno 2</span>
                            <div className="flex gap-x-1 pl-30">
                                <button className="btn btn-warning">Modificar</button>
                                <button className="btn btn-error">Error</button>
                            </div>
                        </li>
                        
                        <li className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                            <span className="font-bold text-gray-800">Aluno 3</span>
                            <div className="flex gap-x-1 pl-30">
                                <button className="btn btn-warning">Modificar</button>
                                <button className="btn btn-error">Error</button>
                            </div>
                        </li>

                        <li className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                            <span className="font-bold text-gray-800">Aluno 4</span>
                            <div className="flex gap-x-1 pl-30">
                                <button className="btn btn-warning">Modificar</button>
                                <button className="btn btn-error">Error</button>
                            </div>
                        </li>

                    </ul>
                    {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */}
                </div>
                {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */}
            </div>
            {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */}
        </div>
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    );
}

export default StudentsPage;