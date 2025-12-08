import {
  UserVerification,
  Forgotpassword,
} from "../../services/login/LoginValidationService";
import {
  ValidateEmail,
  ValidateVerificationData,
} from "../../helpers/login/validations";
import { modalMessages } from "../../config/modalMessages";

export function ValidateEmailOnPlatform(
  email,
  setCurrentStep,
  setModalData,
  setShowModal,
  setErrorMessageEmail,
  setCargando
) {
  const handleValidation = async (e) => {
    e.preventDefault();
    try {
      setCargando(true);
      const errorMessage_ = ValidateEmail(email);
      if (errorMessage_) {
        setErrorMessageEmail(true);
        setModalData(modalMessages.error({ message: errorMessage_ }));
        return;
      }

      const response = await UserVerification(email);
      console.log("Logica", response);
      if (response) {
        console.log("Entro en esta condicional");
        // await Forgotpassword(email);
        setShowModal(true);
        setModalData(
          modalMessages.success({
            message: response,
          })
        );
        setCurrentStep(2);
      } else {
        setShowModal(true);
        setModalData(
          modalMessages.error({
            message: "El correo electrónico no esta registrado",
          })
        );
      }
    } catch (error) {
      setShowModal(true);
      setModalData(modalMessages.error({ message: error.message }));
    } finally {
      setCargando(false);
    }
  };

  return handleValidation;
}

export function CodeVerification(
  newPassword,
  token,
  setModalData,
  setCodigoVericacion,
  setCodigoVerificacionError,
  setCargando
) {
  const handleCodeVerification = async (e) => {
    e.preventDefault();
    try {
      setCargando(true);
      const errorMessage = ValidateVerificationData(newPassword, token);
      if (errorMessage) {
        setCodigoVerificacionError(true);
        setModalData(modalMessages.error({ message: errorMessage }));
        return;
      }
      const response = await Forgotpassword(newPassword, token);
      if (response) {
        setCodigoVericacion(true);
        setModalData(
          modalMessages.success({
            message:
              "Contraseña cambiado exitosamente. Por favor, ahora ingrese a su cuenta",
          })
        );
      }
    } catch (error) {
      setCodigoVerificacionError(true);
      setModalData(modalMessages.error({ message: error.message }));
    } finally {
      setCargando(false);
    }
  };

  return handleCodeVerification;
}
