import { useUser } from "../../hooks/useUser"; // Importa o hook que criamos no MainLayout
import "./style.css";

function ProfilePage() {
    const { user } = useUser();

    return (
        <>
        <p> Perfil de {user?.name} </p>
        </>
    );
}

export default ProfilePage;