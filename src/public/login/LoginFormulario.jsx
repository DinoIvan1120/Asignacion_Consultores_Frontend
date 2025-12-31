import PropTypes from "prop-types";
import Csticorp from "../../assets/imagenes/CSTI-CORP.png";
// import celimaLogo from "../../assets/imagenes/Celima-logo.png";
// import csticorp from "../../assets/imagenes/logo_cstic.png"
// import Logo from "../../assets/imagenes/Logo1.png"
import LLave from "../../assets/imagenes/llave.png";
import Arroba from "../../assets/imagenes/arroba.png";
import Show from "../../assets/imagenes/show.ico";
import Esconder from "../../assets/imagenes/esconder.ico";
import "../../styles/login/LoginFormulario.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export function LoginFormulario({
  isRegister = false,
  alias,
  setAlias,
  birthdayDate,
  setBirthdayDate,
  token,
  setToken,
  email,
  setEmail,
  firstname,
  setFirstname,
  lastname,
  setLastname,
  fullname,
  setFullname,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  handleSubmit,
  usernameLabel = "ID Usuario",
  sectionclassName = "input-container name",
  nombre = "fname",
  usernamePlaceholder = "Analista 01",
  inputType = "email",
  showArrobaIcon = true,
  validarclassName = "contraseña",
  linkclassName = "contraseña-link",

  validarclaseRegistrarse = "registrarse",
  linkclassNameRegistrase = "registrarseLink",

  buttonclassName = "button-container",
  buttonclassNamed = "signup-btn custom-btn",
  inpclassName = "niden",
  labelpassword = "Contraseña",
  linkTo = "./validar",
  linkText = "Olvidé mi contraseña",

  linkToRegister = "./registrarse",
  linkTextRegister = "Registrarse",

  mostrarRegistrarse = false,
  registrarse = "Registrarse",

  buttonText = "Ingresar",
  hidePassword = false,
  hideparrafo = false,
  ptexto = "Crédenciales únicas del proveedor",
  // ptexto = "Crédenciales únicas del usuario",
  cargando,
}) {
  // 🔥 Selección automática entre email/token
  const firstValue = token !== undefined ? token : email;
  const setFirstValue = setToken !== undefined ? setToken : setEmail;

  /*
  // const loadingMessage = cargando
  //    buttonText === "Ingresar"
  //      "Ingresando..."
  //     : buttonText === "Cambiar"
  //        "Cambiando..."
  //       : "Validando..."
  //   : "";
  */

  const loadingMessage = cargando
    ? buttonText === "Ingresar"
      ? "Ingresando..."
      : buttonText === "Cambiar"
        ? "Cambiando..."
        : buttonText === "Validar"
          ? "Validando..."
          : buttonText === "Registrarse"
            ? "Registrando..."
            : ""
    : "";

  return (
    <form
      className={`form ${isRegister ? "form-register" : ""}`}
      onSubmit={handleSubmit}
    >
      <section className="copy">
        <picture className="image-container">
          <img src={Csticorp} alt="Logo de celima" />
        </picture>

        {!isRegister ? (
          <div className="texto-container">
            <h2>Bienevenido a SGR</h2>
            <p>Accede a la plataforma con sus credenciales</p>
            {/* <h2>SGR</h2>
                    <p>Sistema de Gestión de Requerimientos</p> */}
          </div>
        ) : (
          <>
            <div className="texto-container">
              <h2>Bienevenido a SGR</h2>
              <p className={`${isRegister ? "texto-registro" : ""}`}>
                Registrarse a la plataforma
              </p>
              {/* <h2>SGR</h2>
                    <p>Sistema de Gestión de Requerimientos</p> */}
            </div>
          </>
        )}
      </section>

      <section className={sectionclassName}>
        <label htmlFor={nombre}>{usernameLabel}</label>
        <input
          className={inpclassName}
          id={nombre}
          name={nombre}
          placeholder={usernamePlaceholder}
          autoFocus
          type={inputType}
          maxLength="250"
          value={firstValue}
          onChange={(e) => setFirstValue(e.target.value)}
        />
        {showArrobaIcon && (
          <img
            src={Arroba}
            alt="ícono del usuario"
            className={`input-arroba ${isRegister ? "register-icon" : ""}`}
          />
        )}
        {!hideparrafo && <p>{ptexto}</p>}
      </section>

      {!hidePassword && (
        <section className="input-container password">
          <label htmlFor="password">{labelpassword}</label>
          <input
            id="password"
            name="password"
            placeholder="........"
            type={showPassword ? "text" : "password"}
            maxLength="28"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={showPassword ? "has-icon" : ""}
          />
          <img
            src={LLave}
            alt="ícono de password"
            className={`input-icon ${isRegister ? "register-icon" : ""}`}
          />
          <img
            src={showPassword ? Show : Esconder}
            alt="Mostrar/Ocultar contraseña"
            className="toggle-password-icon"
            onClick={() => setShowPassword(!showPassword)}
          />
        </section>
      )}

      {/* 🔹 Inputs de registro */}
      {isRegister && (
        <>
          <section className="input-container name register-input cambio">
            <label>Nombre</label>
            <input
              type="text"
              placeholder="Nombre completo"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className={inpclassName}
            />
            {/* {showArrobaIcon && (
              <img
                src={Arroba}
                alt="ícono del usuario"
                className={`input-arroba ${isRegister ? "register-icon" : ""}`}
              />
            )}
            {!hideparrafo && <p>{ptexto}</p>} */}
          </section>

          <section className="input-container name register-input cambio">
            <label>Apellido</label>
            <input
              type="text"
              placeholder="Apellido completo"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className={inpclassName}
            />
            {/* {showArrobaIcon && (
              <img
                src={Arroba}
                alt="ícono del usuario"
                className={`input-arroba ${isRegister ? "register-icon" : ""}`}
              />
            )}
            {!hideparrafo && <p>{ptexto}</p>} */}
          </section>
          {/* <section className="input-container name register-input cambio">
            <label>Fecha de nacimiento</label>
            <input
              type="date"
              value={birthdayDate}
              onChange={(e) => setBirthdayDate(e.target.value)}
              className={inpclassName}
            />
          </section> */}
          <section className="input-container name register-input cambio">
            <label>Fecha de nacimiento</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="dd/mm/yyyy"
              value={birthdayDate}
              className={inpclassName}
              onChange={(e) => {
                let value = e.target.value;
                const prev = birthdayDate; // valor anterior

                // Solo permitir números y "/"
                value = value.replace(/[^0-9/]/g, "");

                // 👉 Permitir borrar libremente
                if (value.length < prev.length) {
                  setBirthdayDate(value);
                  return;
                }

                // 👉 Auto-insertar "/" después del día
                if (value.length === 2 && !value.includes("/")) {
                  value = value + "/";
                }

                // 👉 Auto-insertar "/" después del mes
                if (value.length === 5 && value.charAt(2) === "/") {
                  value = value + "/";
                }

                // Limitar a 10 caracteres (dd/mm/yyyy)
                if (value.length <= 10) {
                  setBirthdayDate(value);
                }
              }}
              onBlur={() => {
                // Convertir a yyyy-mm-dd solo si el formato es completo
                if (birthdayDate.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
                  const [d, m, y] = birthdayDate.split("/");
                  const formatted = `${y}-${m}-${d}`;
                  setBirthdayDate(formatted);
                }
              }}
            />
          </section>
        </>
      )}

      <section
        className={`${validarclassName} ${isRegister ? "register-validar-section" : ""}`}
      >
        <Link
          to={linkTo}
          className={`${linkclassName} ${isRegister ? "register-validar-link" : ""}`}
        >
          {linkText}
        </Link>
      </section>

      {/* {mostrarRegistrarse && (
        <section className={validarclaseRegistrarse}>
          <Link to={linkToRegister} className={linkclassName}>
            {linkTextRegister}
          </Link>
        </section>
      )} */}

      <section
        className={`${buttonclassName} ${isRegister ? "button-register-section" : ""}`}
      >
        <button
          className={`${buttonclassNamed} ${isRegister ? "button-register" : ""}`}
          type="submit"
          disabled={cargando}
        >
          {cargando ? (
            <span>
              <FontAwesomeIcon icon={faSpinner} spin /> {loadingMessage}
            </span>
          ) : (
            buttonText
          )}
        </button>
      </section>

      <section
        className={`footer-formulario ${isRegister ? "footer-register" : ""}`}
      >
        <p>Desarrollado por CSTI</p>
      </section>
    </form>
  );
}

LoginFormulario.propTypes = {
  isRegister: PropTypes.bool,
  alias: PropTypes.string,
  setAlias: PropTypes.func,
  birthdayDate: PropTypes.string,
  setBirthdayDate: PropTypes.func,
  token: PropTypes.number,
  setToken: PropTypes.func,
  email: PropTypes.string,
  setEmail: PropTypes.func,
  firstname: PropTypes.string,
  setFirstname: PropTypes.func,
  lastname: PropTypes.string,
  setLastname: PropTypes.func,
  fullname: PropTypes.string,
  setFullname: PropTypes.func,
  password: PropTypes.string,
  setPassword: PropTypes.func,
  showPassword: PropTypes.bool,
  setShowPassword: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  usernameLabel: PropTypes.string,
  sectionclassName: PropTypes.string,
  nombre: PropTypes.string,
  usernamePlaceholder: PropTypes.string,
  inputType: PropTypes.string,
  showArrobaIcon: PropTypes.bool,
  hidePassword: PropTypes.bool,
  hideparrafo: PropTypes.bool,
  validarclassName: PropTypes.string,
  linkclassName: PropTypes.string,
  linkclassNameRegistrase: PropTypes.string,
  buttonclassName: PropTypes.string,
  buttonclassNamed: PropTypes.string,
  inpclassName: PropTypes.string,

  linkTo: PropTypes.string,
  linkText: PropTypes.string,

  linkToRegister: PropTypes.string,
  linkTextRegister: PropTypes.string,

  registrarse: PropTypes.string,
  mostrarRegistrarse: PropTypes.bool,
  validarclaseRegistrarse: PropTypes.string,
  buttonText: PropTypes.string,
  labelpassword: PropTypes.string,
  ptexto: PropTypes.string,
  cargando: PropTypes.bool,
};
