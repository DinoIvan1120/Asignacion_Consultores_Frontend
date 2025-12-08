import { useState } from "react";

export function LoginValidationState() {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [token, setToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalData, setModalData] = useState({
    title: "",
    message: "",
    icon: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [codigoVerificacion, setCodigoVericacion] = useState(false);
  const [codigoVerificacionError, setCodigoVerificacionError] = useState(false);
  const [errorMessageEmail, setErrorMessageEmail] = useState(false);
  const [cargando, setCargando] = useState(false);

  return {
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
    isModalOpen,
    setIsModalOpen,
    errorMessage,
    setErrorMessage,
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
  };
}
