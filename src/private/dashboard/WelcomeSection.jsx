import Proptypes from "prop-types";
import "../../styles/dashboard/WelcomeSection.css";

export function WelcomeSection({ menuOpen, loading, userEmail }) {
  return (
    <section className="Bienvenido">
      <section
        className={
          menuOpen ? "Bienvenido__texto--abierto " : "Bienvenido__texto"
        }
      >
        <h1>Bienvenido {loading ? "Cargando..." : userEmail}</h1>
        {/* <h1>Bienvenido Dino</h1> */}
        <p>Opciones disponibles para acceder</p>
      </section>
    </section>
  );
}

WelcomeSection.propTypes = {
  menuOpen: Proptypes.bool.isRequired,
  loading: Proptypes.bool.isRequired,
  userEmail: Proptypes.string.isRequired,
};
