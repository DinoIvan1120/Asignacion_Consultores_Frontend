import { useState } from "react";

export function RegisterState() {
  const [alias, setAlias] = useState("");
  const [birthdayDate, setBirthdayDate] = useState("");
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalError, setShowModalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalData, setModalData] = useState({
    title: "",
    message: "",
    icon: "",
  });

  return {
    alias,
    setAlias,
    birthdayDate,
    setBirthdayDate,
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
  };
}
