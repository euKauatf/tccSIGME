import "./style.css";
import { useUser } from "../../hooks/useUser";
import QRCode from "react-qr-code";

function ProfilePage() {
  const { user, isAdmin } = useUser();

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col divp rounded-[20px] mt-6 p-6 sm:p-8 bg-emerald-50 shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <img src="/images/icon.svg" alt="Avatar" className="w-32 h-32 md:w-40 md:h-40 rounded-full ring-4 ring-emerald-600 object-cover" />
            </div>
            <div className="flex flex-col text-center md:text-left">
              <h2 className="text-4xl font-bold text-emerald-700">
                {user?.name}
              </h2>
              <p className="mt-2 text-gray-600">
                <strong>Email:</strong> {user?.email}
              </p>
              {/* Mostra o tipo do perfil apenas se for admin, usando operador ternário */}
              {isAdmin ? (
                <p className="text-gray-600">
                  <strong>Tipo:</strong> Administrador
                </p>
              ) : (
              <>
              <p className="text-gray-600">
                <strong>Matrícula:</strong> {user?.matricula}
              </p>
              <p className="text-gray-600">
                <strong>CPF:</strong> {user?.cpf}
              </p>
              </>
              )}
            </div>
          </div>

          {/* Mostra o QR Code apenas se NÃO for admin e tiver matrícula, usando operador ternário */}
          {!isAdmin && user?.matricula ? (
            <div className="mt-8 pt-6 border-t border-emerald-200">
              <h3 className="text-center text-lg font-semibold text-emerald-700 mb-4">
                Seu QR Code para presenças
              </h3>
              <div className="bg-white p-4 rounded-lg shadow-inner max-w-[200px] mx-auto">
                <QRCode value={String(user.matricula)} title={String(user.matricula)} size={256} fgColor="#065f46" bgColor="#FFFFFF" style={{ height: "auto", maxWidth: "100%", width: "100%" }} viewBox={`0 0 256 256`} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;