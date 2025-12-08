import { LoginFormulario } from "./LoginFormulario";
import PropTypes from "prop-types";

export const Step1 = ({
  handleValidation,
  email,
  setEmail,
  setShowPassword,
  cargando,
}) => {
  return (
    <LoginFormulario
      handleSubmit={handleValidation}
      email={email}
      setEmail={setEmail}
      setShowPassword={setShowPassword}
      usernameLabel="Correo electrónico"
      sectionclassName="input-container name"
      nombre="fcorreo"
      usernamePlaceholder="Analista 01"
      inputType="email"
      showArrobaIcon={true}
      hideparrafo={true}
      hidePassword={true}
      validarclassName="accede"
      linkclassName="contraseña-link"
      buttonclassName="containe"
      buttonclassNamed="signup-btn custom-btn"
      linkTo="/"
      linkText="Volver a su cuenta"
      buttonText="Validar"
      cargando={cargando}
      mostrarRegistrarse={false}
    />
  );
};

Step1.propTypes = {
  handleValidation: PropTypes.func,
  email: PropTypes.string,
  setEmail: PropTypes.func,
  setShowPassword: PropTypes.func,
  cargando: PropTypes.bool,
};

export const Step2 = ({
  handleCodeVerification,
  token,
  setToken,
  newPassword,
  setNewPassword,
  showPassword,
  setShowPassword,
  cargando,
}) => {
  return (
    <LoginFormulario
      handleSubmit={handleCodeVerification}
      usernameLabel="Verificar código"
      sectionclassName="input-container codigo"
      nombre="fcodigo"
      usernamePlaceholder="875077"
      inputType="text"
      ptexto="Código de verificación"
      inpclassName="codigo"
      token={token}
      setToken={setToken}
      labelpassword="Contraseña nueva"
      password={newPassword}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      setPassword={setNewPassword}
      showArrobaIcon={false}
      validarclassName="acceder"
      linkclassName="contr-link"
      buttonclassName="container"
      buttonclassNamed="signup-btnn custom-btnn"
      linkTo="/"
      linkText="Acceder a tu cuenta"
      buttonText="Cambiar"
      cargando={cargando}
      mostrarRegistrarse={false}
    />
  );
};

Step2.propTypes = {
  handleCodeVerification: PropTypes.func,
  token: PropTypes.number,
  setToken: PropTypes.func,
  newPassword: PropTypes.string,
  setNewPassword: PropTypes.func,
  showPassword: PropTypes.bool,
  setShowPassword: PropTypes.func,
  cargando: PropTypes.bool,
};
