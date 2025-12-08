import Proptypes from "prop-types";
import "../../styles/features/HeadTitleSection.css";

export function HeadTitleSection({ menuOpen, Titulo }) {
  return (
    <>
      <section className={menuOpen ? "headbar" : "headbar--abierto headbar"}>
        <div className="headbar__title">
          <h3> {Titulo}</h3>
          <p>Coordinación, control y optimización</p>
        </div>

        <div className="headbar__acciones">
          <button className="btn btn--ico btn--medium btn__secondary--outline">
            <i className="bi bi-arrow-repeat"></i>
            Migrar SAP
          </button>
        </div>
      </section>
    </>
  );
}

HeadTitleSection.propTypes = {
  menuOpen: Proptypes.bool.isRequired,
  Titulo: Proptypes.string.isRequired,
};
