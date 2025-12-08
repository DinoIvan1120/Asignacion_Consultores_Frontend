import { useState } from "react";

export function DashboardState() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    message: "",
    icon: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [userIniciales, setUserIniciales] = useState("");
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");

  return {
    menuOpen,
    setMenuOpen,
    showLogoutPopup,
    setShowLogoutPopup,
    modalData,
    setModalData,
    showModal,
    setShowModal,
    loading,
    setLoading,
    userEmail,
    setUserEmail,
    userIniciales,
    setUserIniciales,
    user,
    setUser,
    role,
    setRole,
  };
}
