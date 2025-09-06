import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { createPalestrante, getPalestranteById, updatePalestrante } from '../../api/apiClient';
import type { Palestrante } from '../../types';
import { IMaskInput } from 'react-imask';

type PalestranteFormData = Omit<Palestrante, 'id'>;

function FormPalestrantePage() {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<Partial<PalestranteFormData>>({
        name: '',
        email: '',
        telefone: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null); // Erro de carregamento
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Erro de envio

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            const fetchPalestrante = async () => {
                try {
                    const response = await getPalestranteById(parseInt(id));
                    setFormData(response.data);
                } catch (err) {
                    console.error("Erro ao buscar dados do palestrante:", err);
                    setError("Não foi possível encontrar o palestrante para edição.");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchPalestrante();
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        setIsLoading(true);

        try {
            if (id) {
                await updatePalestrante(parseInt(id), formData as PalestranteFormData);
                navigate('/palestrantes', { state: { message: "Palestrante atualizado com sucesso!" } });
            } else {
                await createPalestrante(formData as PalestranteFormData);
                navigate('/palestrantes', { state: { message: "Palestrante criado com sucesso!" } });
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

    if (isLoading && !formData.name) {
        return <p className="p-8 text-center">A carregar...</p>;
    }

    if (error) {
        return <p className="p-8 text-center text-red-500">{error}</p>;
    }

    return (
        // ✅ CORREÇÃO: Removido 'min-h-screen' e 'items-center' para alinhar ao topo.
        <div className="flex justify-center w-full p-4 font-sans main sm:p-6 lg:p-8">
            <div className="w-full max-w-2xl">
                {errorMessage && (
                    <div role="alert" className="mb-4 alert alert-error">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 stroke-current shrink-0" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{errorMessage}</span>
                    </div>
                )}
                <div className="p-6 shadow-lg divp rounded-2xl bg-emerald-50 sm:p-8">
                    <h1 className="py-3 text-3xl font-bold text-center text-emerald-600">
                        {id ? 'Editar Palestrante' : 'Adicionar Palestrante'}
                    </h1>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium">Nome do Palestrante</label>
                            <input type="text" id="name" name="name" value={formData.name || ''} onChange={handleChange} className="block w-full mt-1 input input-bordered" required />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium">Email</label>
                            <input type="email" id="email" name="email" value={formData.email || ''} onChange={handleChange} className="block w-full mt-1 input input-bordered" required />
                        </div>
                        <div>
                            <label htmlFor="telefone" className="block text-sm font-medium">Telefone</label>
                            <IMaskInput
                                mask="(00) 00000-0000"
                                id="telefone"
                                name="telefone"
                                value={formData.telefone || ''}
                                placeholder="(00) 00000-0000"
                                className="w-full input input-bordered"
                                required
                                onAccept={(value) => {
                                    handleChange({ target: { name: 'telefone', value } } as React.ChangeEvent<HTMLInputElement>);
                                }}
                            />
                        </div>
                        <div className="flex justify-end gap-4 mt-6">
                            <button type="button" onClick={() => navigate('/palestrantes')} className="btn btn-ghost">Cancelar</button>
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

export default FormPalestrantePage;

