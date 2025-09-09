import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { createLocal, getLocalById, updateLocal } from '../../api/apiClient';
import type { Local } from '../../types';

type LocalFormData = Omit<Local, 'id'>;

function FormLocalPage() {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<Partial<LocalFormData>>({
        name: '',
        capacidade: 1
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            const fetchLocal = async () => {
                try {
                    const response = await getLocalById(parseInt(id));
                    setFormData(response.data);
                } catch (err) {
                    console.error(err);
                    setErrorMessage('Não foi possível carregar o local.');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchLocal();
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'capacidade' ? parseInt(value) : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        if (!formData.name || formData.name.trim() === '') {
            setErrorMessage('O nome do local é obrigatório.');
            return;
        }

        if (!formData.capacidade || formData.capacidade < 1) {
            setErrorMessage('A capacidade deve ser um número maior que 0.');
            return;
        }

        setIsLoading(true);
        try {
            if (id) {
                await updateLocal(parseInt(id), formData as LocalFormData);
                navigate('/locais', { state: { message: 'Local atualizado com sucesso!' } });
            } else {
                await createLocal(formData as LocalFormData);
                navigate('/locais', { state: { message: 'Local criado com sucesso!' } });
            }
        } catch (err) {
            let message = 'Ocorreu um erro inesperado.';
            if (isAxiosError(err) && err.response) {
                const responseData = err.response.data;
                if (responseData.errors) {
                    const firstErrorKey = Object.keys(responseData.errors)[0];
                    message = responseData.errors[firstErrorKey][0];
                } else if (responseData.message) {
                    message = responseData.message;
                }
            }
            setErrorMessage(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center w-full p-4 font-sans main sm:p-6 lg:p-8">
            <div className="w-full max-w-2xl">
                {errorMessage && (
                    <div role="alert" className="mb-4 alert alert-error">
                        <span>{errorMessage}</span>
                    </div>
                )}
                <div className="p-6 shadow-lg divp rounded-2xl bg-emerald-50 sm:p-8">
                    <h1 className="py-3 text-3xl font-bold text-center text-emerald-600">
                        {id ? 'Editar Local' : 'Adicionar Local'}
                    </h1>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium">Nome do Local</label>
                            <input type="text" id="name" name="name" value={formData.name || ''} onChange={handleChange} className="block w-full mt-1 input input-bordered" required />
                        </div>
                        <div>
                            <label htmlFor="capacidade" className="block text-sm font-medium">Capacidade</label>
                            <input type="number" id="capacidade" name="capacidade" value={formData.capacidade || 1} min={1} onChange={handleChange} className="block w-full mt-1 input input-bordered" required />
                        </div>
                        <div className="flex justify-end gap-4 mt-6">
                            <button type="button" onClick={() => navigate('/locais')} className="btn btn-ghost">Cancelar</button>
                            <button type="submit" className="btn btn-success" disabled={isLoading}>
                                {isLoading ? 'A salvar...' : 'Salvar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default FormLocalPage;
