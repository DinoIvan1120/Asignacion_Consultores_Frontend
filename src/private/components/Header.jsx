import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../styles/components/Header.css";
import PropTypes from "prop-types";

export function Header({
  setMenuOpen,
  menuOpen,
  Imagenes,
  loading,
  userIniciales,
  role,
  userEmail,
  showLogoutPopup,
  handleLogout,
  setShowLogoutPopup,
}) {
  return (
    <header className="Header">
      <div className="Header__menu">
        <FontAwesomeIcon
          icon={faBars}
          onClick={() => setMenuOpen(!menuOpen)}
          className="menu-icon"
        />
      </div>
      <div className="Header__imagenes">
        <img
          src={Imagenes}
          className="Header__imagen--logotipo"
          alt="imagenes"
        />
      </div>

      <div className="Header__contenido">
        <div className="Header__nombre">
          <span className="Header__nombre--inicial">
            {loading ? "..." : userIniciales}
          </span>
        </div>

        <section className="Header__texto">
          <h1 className="Header__texto-h1">
            {loading ? "Cargando..." : userEmail}
          </h1>
          <p className="Header__texto-p">{loading ? "Cargando..." : role}</p>
        </section>

        <div
          className="Header__opcion"
          onClick={() => setShowLogoutPopup(!showLogoutPopup)}
        >
          <span></span>
          {showLogoutPopup && (
            <div className="Header__logout-popup">
              <button onClick={handleLogout}>Cerrar sesión</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  setMenuOpen: PropTypes.func.isRequired,
  menuOpen: PropTypes.bool.isRequired,
  Imagenes: PropTypes.string.isRequired,
  Figura: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  userIniciales: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  userEmail: PropTypes.string.isRequired,
  showLogoutPopup: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
  setShowLogoutPopup: PropTypes.func.isRequired,
};
