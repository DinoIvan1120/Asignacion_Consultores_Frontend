import { LoginValidationState } from "../../hooks/login/LoginValidationState";
import {
  ValidateEmailOnPlatform,
  CodeVerification,
} from "../../hooks/login/LoginValidationProcess.js";
import { LoginPublicidad } from "./LoginPublicidad";
import "../../styles/login/LoginValidation.css";
import { Verificacion } from "../modal/Modals.jsx";
import { useNavigate } from "react-router-dom";
import { Step1, Step2 } from "./Steps.jsx";

export function LoginValidation() {
  const navigate = useNavigate();

  const {
    currentStep,
    setCurrentStep,
    email,
    setEmail,
    newPassword,
    setNewPassword,
    token,
    setToken,
    showPassword,
    setShowPassword,
    modalData,
    setModalData,
    showModal,
    setShowModal,
    codigoVerificacion,
    setCodigoVericacion,
    errorMessageEmail,
    setErrorMessageEmail,
    codigoVerificacionError,
    setCodigoVerificacionError,
    cargando,
    setCargando,
  } = LoginValidationState();

  const handleValidation = ValidateEmailOnPlatform(
    email,
    setCurrentStep,
    setModalData,
    setShowModal,
    setErrorMessageEmail,
    setCargando
  );

  const handleCloseModal = () => {
    setShowModal(false);
    setErrorMessageEmail(false);
  };

  const handleCloseModalCodigoVerificacion = () => {
    setCodigoVericacion(false);
    navigate("/");
  };

  const handleCloseModalCodigoVerificacionError = () => {
    setCodigoVerificacionError(false);
  };

  const handleCodeVerification = CodeVerification(
    newPassword,
    token,
    setModalData,
    setCodigoVericacion,
    setCodigoVerificacionError,
    setCargando
  );

  const steps = {
    1: (
      <Step1
        handleValidation={handleValidation}
        email={email}
        setEmail={setEmail}
        setShowPassword={setShowPassword}
        cargando={cargando}
      />
    ),
    2: (
      <Step2
        handleCodeVerification={handleCodeVerification}
        //handleCodeVerification={handleCloseModalCodigoVerificacion}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        token={token}
        setToken={setToken}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        cargando={cargando}
      />
    ),
  };

  return (
    <>
      <section className="contenedor__principal">
        <section className="conteneder__principal--left">
          <LoginPublicidad />
        </section>

        <section className="contenedor__principal--right">
          {steps[currentStep]}
        </section>
      </section>

      {showModal && (
        <Verificacion
          isOpen={true}
          onClose={handleCloseModal}
          data={modalData}
        />
      )}

      {codigoVerificacion && (
        <Verificacion
          isOpen={true}
          onClose={handleCloseModalCodigoVerificacion}
          data={modalData}
        />
      )}

      {codigoVerificacionError && (
        <Verificacion
          isOpen={true}
          onClose={handleCloseModalCodigoVerificacionError}
          data={modalData}
        />
      )}

      {errorMessageEmail && (
        <Verificacion
          isOpen={true}
          onClose={handleCloseModal}
          data={modalData}
        />
      )}
    </>
  );
}
