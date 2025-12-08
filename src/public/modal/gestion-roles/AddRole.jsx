import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

export const AddRole = ({ onClose }) => {
  const [fields, setFields] = useState({
    name: "",
    user: [],
  });
  const [users, setUsers] = useState([]);
  const [usersSelected, setUsersSelected] = useState([]);
  const [errors, setErrors] = useState({ noError: true });
  const handleInputChange = (e) => {
    if (e.target.name === "user") {
      if (usersSelected.includes(Number(e.target.value))) {
        setErrors({ ...errors, user: "El usuario ya fue seleccionado" });
      }
      setUsersSelected([...usersSelected, Number(e.target.value)]);
      return;
    }
    setFields({
      ...fields,
      [e.target.name]: e.target.value,
    });
  };
  const handleClickDeleteField = (idUser) => {
    const usersSelectedUpdated = usersSelected.filter(
      (userSelected) => userSelected !== idUser
    );
    setUsersSelected([...usersSelectedUpdated]);
  };
  useEffect(() => {
    const testSubmit = () => {
      const user = {
        name: fields.name,
        update_user: usersSelected,
      };
      if (Object.keys(errors).length === 0) {
        onClose();
      }
    };
    testSubmit();
  }, [errors, fields.name, usersSelected, onClose]);

  return (
    <div className="customModal">
      <div className="customModal__content customModal__content--medium">
        <div className="direccion">
          <button className="signup-x" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <h3>Crear Role</h3>
        <div className="form mt-4">
          <div className="form__group">
            <label className="configurar">Nombre del Rol</label>
            <input
              onChange={handleInputChange}
              placeholder="Ingresar el nombre de rol"
              type="text"
              name="name"
            />
          </div>
          <div className="form__group">
            <label className="configurar">Usuarios</label>
            <select onChange={handleInputChange} className="w-100" name="user">
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form__group">
            {usersSelected.length > 0 ? (
              users
                .filter((user) => usersSelected.includes(user.id))
                .map((user) => (
                  <div key={user.id} className="form__group">
                    <label style={{ display: "inline" }} key={user.id}>
                      {user.first_name} {user.last_name}
                    </label>
                    <i
                      className="bi bi-trash3"
                      onClick={() => handleClickDeleteField(user.id)}
                    />
                  </div>
                ))
            ) : (
              <p>No hay usuarios seleccionados</p>
            )}
          </div>
        </div>
        <div className="customModal__buttons">
          <button className="btn btn--small btn__primary m-2">Guardar</button>
        </div>
      </div>
    </div>
  );
};
AddRole.propTypes = {
  onClose: PropTypes.func.isRequired,
};
