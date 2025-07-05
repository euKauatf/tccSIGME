import { useUser } from "../../hooks/useUser"; // Importa o hook que criamos no MainLayout
import "./style.css";

function EventsPage() {
    const { user } = useUser();

    return (
        <>
        <p> Eventos de {user?.name} </p>
        </>
    );
}

export default EventsPage;