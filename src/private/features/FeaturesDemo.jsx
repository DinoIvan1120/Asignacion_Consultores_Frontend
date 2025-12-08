import { useAuth } from "../../contexts/Authutils";
import {
  DashboardNavegation,
  useFectchUserData,
} from "../../hooks/dashboard/DashboardProcess";
import Imagenes from "../../assets/imagenes/CSTI-SAP.png";
import Figura from "../../assets/imagenes/Figura.png";
import { DashboardState } from "../../hooks/dashboard/DashboardState";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { SideMenu } from "../components/SideMenu";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export function FeaturesDemo() {
  const {
    showLogoutPopup,
    setShowLogoutPopup,
    userEmail,
    setUserEmail,
    loading,
    setLoading,
    userIniciales,
    setUserIniciales,
    role,
    setRole,
    setShowModal,
    setModalData,
  } = DashboardState();

  const [menuOpen, setMenuOpen] = useState(true);

  const { accessToken } = useAuth();

  const handleLogout = DashboardNavegation(setShowLogoutPopup);

  useFectchUserData(
    accessToken,
    setLoading,
    setUserEmail,
    setUserIniciales,
    setRole,
    setShowModal,
    setModalData
  );

  console.log("Inicial: ", userIniciales);
  console.log("Role: ", role);

  return (
    <>
      <Header
        setMenuOpen={setMenuOpen}
        menuOpen={menuOpen}
        Imagenes={Imagenes}
        Figura={Figura}
        loading={loading}
        userIniciales={userIniciales}
        role={role}
        userEmail={userEmail}
        showLogoutPopup={showLogoutPopup}
        handleLogout={handleLogout}
        setShowLogoutPopup={setShowLogoutPopup}
      />

      <SideMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <section>
        <Outlet menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      </section>

      <Footer />
    </>
  );
}
