import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

export const AddUser = ({ onClose }) => {
  const [fields, setFields] = useState({
    first_name: "",
    last_name: "",
    email: "",
    company: null,
  });
  const [isThirdParty, setIsThirdParty] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [errors, setErrors] = useState({ noError: true });
  const handleInputChange = (e) => {
    if (e.target.name === "third_party") {
      setIsThirdParty(e.target.value === "true");
      return;
    }
    setFields({
      ...fields,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="customModal">
      <div className="customModal__content customModal__content--medium">
        <div className="direccion">
          <button className="signup-x" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <h3>Crear Usuario</h3>
        <div className="form mt-4">
          <div className="form__group">
            <label className="configurar">Nombres</label>
            <input
              onChange={handleInputChange}
              type="text"
              name="first_name"
              placeholder="Ingrese los nombres"
            />
          </div>

          <div className="form__group">
            <label className="configurar">Apellidos</label>
            <input
              placeholder="Ingrese los apellidos"
              onChange={handleInputChange}
              type="text"
              name="last_name"
            />
          </div>

          <div className="form__group">
            <label className="configurar">Correo Electronico:</label>
            <input
              placeholder="Ingrese el correo eletrónico"
              onChange={handleInputChange}
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
AddUser.propTypes = {
  onClose: PropTypes.func.isRequired,
};
