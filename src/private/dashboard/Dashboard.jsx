import { DashboardState } from "../../hooks/dashboard/DashboardState";
import { DashboardNavegation } from "../../hooks/dashboard/DashboardProcess";
import Imagenes from "../../assets/imagenes/CSTI-SAP.png";
import Figura from "../../assets/imagenes/Figura.png";
import { useFectchUserData } from "../../hooks/dashboard/DashboardProcess";
import { useAuth } from "../../contexts/Authutils";
import { Header } from "../components/Header";
import { WelcomeSection } from "./WelcomeSection";
import { MainContent } from "./MainContent";
import { Footer } from "../components/Footer";
import { Verificacion } from "../../public/modal/Modals";
import "../../styles/dashboard/Dashboard.css";

export function Dashboard() {
  const {
    menuOpen,
    setMenuOpen,
    showLogoutPopup,
    setShowLogoutPopup,
    modalData,
    setModalData,
    showModal,
    setShowModal,
    userEmail,
    setUserEmail,
    loading,
    setLoading,
    userIniciales,
    setUserIniciales,
    role,
    setRole,
  } = DashboardState();

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
  console;

  const handleCloseModal = () => {
    setShowModal(false);
  };

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

      <WelcomeSection
        menuOpen={menuOpen}
        loading={loading}
        userEmail={userEmail}
      />

      <div
        className={menuOpen ? "menu-overlay--abierto" : "menu-overlay"}
      ></div>

      <div className={menuOpen ? "main--abierto" : "main"}>
        <MainContent />
      </div>

      <Footer />

      {showModal && (
        <Verificacion
          isOpen={showModal}
          onClose={handleCloseModal}
          data={modalData}
        />
      )}
    </>
  );
}
