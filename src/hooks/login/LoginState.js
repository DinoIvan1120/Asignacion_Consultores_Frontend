import { useState } from "react";

export function LoginState() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalData, setModalData] = useState({
    title: "",
    message: "",
    icon: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return {
    isModalOpen,
    setIsModalOpen,
    errorMessage,
    setErrorMessage,
    showModal,
    setShowModal,
    modalData,
    setModalData,
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    isLoading,
    setIsLoading,
  };
}
