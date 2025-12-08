import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { UserInformation } from "../../services/dashboard/DashboardService";
import { modalMessages } from "../../config/modalMessages";

export const obtenerIniciales = (nombreCompleto) => {
  const nombreArray = nombreCompleto.split(" ");
  return nombreArray.map((nombre) => nombre.charAt(0)).join("");
};

//Función para cerrar sesión
export function DashboardNavegation(setShowLogoutPopup) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowLogoutPopup(false);
    navigate("/");
  };

  return handleLogout;
}

//Refrescar el nombre de usuario
export function useFectchUserData(
  accessToken,
  setLoading,
  setUserEmail,
  setUserIniciales,
  setRole,
  setShowModal,
  setModalData
) {
  useEffect(() => {
    const fetchData = async () => {
      if (accessToken) {
        try {
          const userName = await UserInformation(accessToken);
          console.log("Hola: ", userName);
          setLoading(false);
          setUserIniciales(
            (prevIniciales) =>
              obtenerIniciales(userName.nombres) || prevIniciales
          );
          setRole(userName.rol || "");
          setUserEmail(userName.nombres);
        } catch (error) {
          setLoading(false);
          setShowModal(true);
          setModalData(modalMessages.error({ message: error.message }));
        }
      } else {
        setLoading(false);
        setShowModal(true);
        setModalData(
          modalMessages.error({ message: `No existe token: ${accessToken}` })
        );
      }
    };

    fetchData();
  }, [
    accessToken,
    setLoading,
    setUserEmail,
    setUserIniciales,
    setRole,
    setShowModal,
    setModalData,
  ]);
}
