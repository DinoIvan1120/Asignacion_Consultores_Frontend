import { useNavigate } from "react-router-dom";
import { ValidateRegisterData } from "../../helpers/register/registerValidation";
import { RegisterUser } from "../../services/register/registerService";
import { modalMessages } from "../../config/modalMessages";

export function RegisterProcess(
  setModalData,
  setShowModal,
  setShowModalError,
  setErrorMessage,
  setCargando
) {
  const navigate = useNavigate();

  return async function handleRegister(userData) {
    try {
      setCargando(true);

      // Validación
      const error = ValidateRegisterData(userData);
      if (error) {
        setShowModalError(true);
        setErrorMessage(error);
        return;
      }

      // Llamada al servicio
      const response = await RegisterUser(
        userData.alias,
        userData.birthdayDate,
        userData.email,
        userData.firstname,
        userData.fullname,
        userData.lastname,
        userData.password
      );

      console.log("Registro exitoso: ", response);
      if (response) {
        setShowModal(true);
        setModalData(
          modalMessages.success({
            message: "Se registro exitosamente",
          })
        );
      }
    } catch (error) {
      console.log("Error en registro: ", error);
      setShowModal(true);
      setModalData(modalMessages.error({ message: error.message }));
    } finally {
      setCargando(false);
    }
  };
}
