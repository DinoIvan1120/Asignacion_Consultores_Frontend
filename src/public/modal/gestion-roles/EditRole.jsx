import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import PropTypes from "prop-types";

export const EditRole = ({ onClose }) => {
  const [fields, setFields] = useState({
    user: [],
  });
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({ noError: true });

  const handleInputChange = (e) => {
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
        <h3>Editar Rol</h3>
        <div className="form mt-4">
          <div className="form__group">
            <label className="configurar">Nombre del rol</label>
            <input
              value={fields.name}
              onChange={handleInputChange}
              placeholder="Ingresar el nombre de rol"
              type="text"
              name="name"
            />
          </div>
          <div className="form__group">
            <label className="configurar">Usuarios</label>
            <select onChange={handleInputChange} className="w-100" name="user">
              <option value="">Seleccionar usuario...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form__group"></div>
        </div>
        <div className="customModal__buttons">
          <button className="btn btn--small btn__primary m-2">Guardar</button>
        </div>
      </div>
    </div>
  );
};
EditRole.propTypes = {
  onClose: PropTypes.func.isRequired,
};
