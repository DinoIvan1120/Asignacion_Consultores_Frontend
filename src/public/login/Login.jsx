import { LoginState } from "../../hooks/login/LoginState";
import { LoginProcess } from "../../hooks/login/LoginProcess";
import { LoginFormulario } from "./LoginFormulario";
import { LoginPublicidad } from "./LoginPublicidad";
import { ErrorModal } from "../modal/Modals";
import { ValidateLoginData } from "../../helpers/login/validations";
import "../../styles/login/Login.css";
import "../../styles/login/LoginAnimations.css";

export function Login() {
  const {
    isModalOpen,
    setIsModalOpen,
    errorMessage,
    setErrorMessage,
    setShowModal,
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    isLoading,
    setIsLoading,
  } = LoginState();

  const handleLogin = LoginProcess(
    setIsModalOpen,
    setErrorMessage,
    setShowModal,
    setIsLoading
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errorMessage = ValidateLoginData(email, password);

    if (errorMessage) {
      setIsModalOpen(true);
      setErrorMessage(errorMessage);
    } else {
      handleLogin(email, password);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <ErrorModal
        isOpen={isModalOpen}
        onClose={closeModal}
        message={errorMessage}
      />
      <section className="contenedor__principal">
        <section className="conteneder__principal--left">
          <LoginPublicidad />
        </section>
        <section className="contenedor__principal--right">
          <LoginFormulario
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            handleSubmit={handleSubmit}
            cargando={isLoading}
            mostrarRegistrarse={true}
          />
        </section>
      </section>
    </>
  );
}
