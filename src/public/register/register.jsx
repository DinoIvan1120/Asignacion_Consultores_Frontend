import { RegisterState } from "../../hooks/register/RegisterState";
import { RegisterProcess } from "../../hooks/register/RegisterProcess";
import { LoginFormulario } from "../login/LoginFormulario";
import { LoginPublicidad } from "../login/LoginPublicidad";
import { ErrorModal, Verificacion } from "../modal/Modals";
import "../../styles/login/Login.css";
import { ValidateRegisterData } from "../../helpers/register/registerValidation";
import { useNavigate } from "react-router-dom";

export function Register() {
  const navigate = useNavigate();
  const {
    birthdayDate,
    setBirthdayDate,
    email,
    setEmail,
    lastname,
    setLastname,
    fullname,
    setFullname,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    cargando,
    setCargando,
    showModal,
    setShowModal,
    showModalError,
    setShowModalError,
    errorMessage,
    setErrorMessage,
    modalData,
    setModalData,
  } = RegisterState();

  // Lógica de registro con validación y redirección al login
  const handleRegister = RegisterProcess(
    setModalData,
    setShowModal,
    setShowModalError,
    setErrorMessage,
    setCargando
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    // 🔹 Formatear fecha de cumpleaños a YYYY-MM-DD si viene en dd/mm/yyyy
    let formattedBirthday = birthdayDate;
    if (birthdayDate.includes("/")) {
      const [day, month, year] = birthdayDate.split("/");
      formattedBirthday = `${year}-${month}-${day}`;
    }

    // Si alias y firstname están vacíos, generar
    const computedFirstname = fullname.split(" ")[0] || "";
    const computedAlias = fullname.split(" ")[0] || "";

    // Validar campos
    const error = ValidateRegisterData({
      alias: computedAlias,
      firstname: computedFirstname,
      lastname,
      fullname,
      email,
      password,
      birthdayDate: formattedBirthday,
    });

    if (error) {
      setShowModalError(true);
      setErrorMessage(error);
      return;
    }

    // Ejecutar registro
    handleRegister({
      alias: computedAlias,
      firstname: computedFirstname,
      lastname,
      fullname,
      email,
      password,
      birthdayDate,
    });
  };

  const closeModal = () => setShowModalError(false);

  const handleCloseShowModal = () => {
    setShowModal(false);
    navigate("/");
  };

  return (
    <>
      <ErrorModal
        isOpen={showModalError}
        onClose={closeModal}
        message={errorMessage}
      />

      <section className="contenedor__principal">
        <section className="conteneder__principal--left">
          <LoginPublicidad />
        </section>

        <section className="contenedor__principal--right">
          {/* Formulario de registro */}
          <LoginFormulario
            isRegister={true} // Indica que es un registro
            fullname={fullname}
            setFullname={setFullname}
            lastname={lastname}
            setLastname={setLastname}
            birthdayDate={birthdayDate}
            setBirthdayDate={setBirthdayDate}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            handleSubmit={handleSubmit}
            buttonText="Registrarse"
            mostrarRegistrarse={false}
            usernameLabel="Correo electrónico"
            usernamePlaceholder="correo@ejemplo.com"
            sectionclassName="input-container name"
            linkTo="/"
            linkText="Acceder a tu cuenta"
            inpclassName="niden"
            cargando={cargando}
            hideparrafo={true}
          />
        </section>
      </section>

      {showModal && (
        <Verificacion
          isOpen={showModal}
          onClose={handleCloseShowModal}
          data={modalData}
        />
      )}
    </>
  );
}
