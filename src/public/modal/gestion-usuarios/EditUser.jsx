import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

export const EditUser = ({ onClose }) => {
  return (
    <div className="customModal">
      <div className="customModal__content customModal__content--medium">
        <div className="direccion">
          <button className="signup-x" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <h3>Editar Usuario</h3>
        <div className="form mt-4">
          <div className="form__group">
            <label className="configurar">Nombres</label>
            <input
              placeholder="Ingresa los nombres"
              type="text"
              name="first_name"
            />
          </div>

          <div className="form__group">
            <label className="configurar">Apellidos</label>
            <input
              placeholder="Ingresa los apellidos"
              type="text"
              name="last_name"
            />
          </div>

          <div className="form__group">
            <label className="configurar">Correo Electronico:</label>
            <input
              placeholder="Ingresa el correo electrónico"
              type="text"
              name="email"
            />
          </div>
        </div>
        <div className="customModal__buttons">
          <button className="btn btn--small btn__primary m-2">Guardar</button>
        </div>
      </div>
    </div>
  );
};
EditUser.propTypes = {
  onClose: PropTypes.func.isRequired,
};
