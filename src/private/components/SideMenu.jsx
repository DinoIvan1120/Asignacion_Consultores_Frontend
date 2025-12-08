import Proptypes from "prop-types";
import { NavLink } from "react-router-dom";
import {
  faGreaterThan,
  faTimes,
  faLessThan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../styles/components/SideMenu.css";

export function SideMenu({ menuOpen, setMenuOpen }) {
  return (
    <>
      <section className={`menu__side ${menuOpen ? "menu__side_move" : ""}`}>
        <section className="options__menu">
          <NavLink to="/dashboard">
            <div className={`option ${menuOpen ? "menuOpen" : ""}`}>
              <section className="option__d">
                <span></span>
              </section>
              <h4>Principal</h4>
            </div>
          </NavLink>
          <NavLink to="/features/seguimiento">
            <div className={`option ${menuOpen ? "menuOpen" : ""}`}>
              <section className="option__e">
                <span></span>
              </section>
              <h4>Seguimiento</h4>
            </div>
          </NavLink>
          <div className="submenu">
            <ul>
              <li>
                <NavLink exact="true" to="/features/seguimiento/tickets">
                  <span>
                    <em className="icon-nav icon-nav--pedido"></em>
                  </span>
                  Tickets
                </NavLink>
              </li>
            </ul>
            <ul>
              <li>
                <NavLink exact="true" to="/features/seguimiento/actividades">
                  <span>
                    <em className="icon-nav icon-nav--gsficha"></em>
                  </span>
                  Informe de actividades
                </NavLink>
              </li>
            </ul>
            {/* <ul>
              <li>
                <NavLink exact="true" to="/features/seguimiento/segumiento">
                  <span>
                    <em className="icon-nav icon-nav--seguimiento"></em>
                  </span>
                  Descargar Excel
                </NavLink>
              </li>
            </ul> */}
          </div>

          <NavLink to="/features/gestion-usuarios">
            <div className={`option ${menuOpen ? "menuOpen" : ""}`}>
              <section className="option__r">
                <span></span>
              </section>
              <h4>Mantenimiento de usuarios</h4>
            </div>
          </NavLink>

          <div className="submenu">
            <ul>
              <li>
                <NavLink
                  exact="true"
                  to="/features/gestion-usuarios/mantenimiento"
                >
                  <span>
                    <em className="icon-nav icon-nav--gficha"></em>
                  </span>{" "}
                  Mantenimiento de usuarios
                </NavLink>
              </li>
            </ul>
          </div>

          <NavLink to="/features/gestion-roles">
            <div className={`option ${menuOpen ? "menuOpen" : ""}`}>
              <section className="option__r">
                <span></span>
              </section>
              <h4>Gestión de Roles</h4>
            </div>
          </NavLink>

          <div className="submenu">
            <ul>
              <li>
                <NavLink exact="true" to="/features/gestion-roles/roles">
                  <span>
                    <em className="icon-nav icon-nav--gficha"></em>
                  </span>{" "}
                  Roles
                </NavLink>
              </li>
            </ul>
          </div>

          <NavLink to="/features/reportes">
            <div className={`option ${menuOpen ? "menuOpen" : ""}`}>
              <section className="option__i">
                <span></span>
              </section>
              <h4>Reportes de Asignaciones</h4>
            </div>
          </NavLink>
          <div className="submenu">
            <ul>
              <li>
                <NavLink exact="true" to="/features/reportes/reportes">
                  <span>
                    <em className="icon-nav icon-nav--gficha"></em>
                  </span>{" "}
                  Reportes
                </NavLink>
              </li>
            </ul>
          </div>
        </section>
        <div>
          <div className={menuOpen ? "icon-menu--open" : "icon__menu"}>
            <FontAwesomeIcon
              icon={menuOpen ? faLessThan : faGreaterThan}
              onClick={() => setMenuOpen(!menuOpen)}
            />
          </div>

          <div className="icon__cerrar">
            <FontAwesomeIcon
              icon={faTimes}
              onClick={() => setMenuOpen(!menuOpen)}
            />
          </div>
        </div>
      </section>
    </>
  );
}

SideMenu.propTypes = {
  menuOpen: Proptypes.bool.isRequired,
  setMenuOpen: Proptypes.func.isRequired,
};
