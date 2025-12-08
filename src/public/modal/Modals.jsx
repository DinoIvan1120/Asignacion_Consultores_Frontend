import PropTypes from "prop-types";
import "../../styles/modal/Modals.css";
import "../../styles/global/button.css";
import { FaTimes, FaCheck, FaExclamationTriangle } from "react-icons/fa";

export function ErrorModal({ isOpen, onClose, message }) {
  if (!isOpen) return null;
  return (
    <div className="customModal">
      <div className="customModal__content">
        <FaTimes className="color-red" />
        <p className="message">{message}</p>
        <button className="btn btn__primary" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}

ErrorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

export function Verificacion({ isOpen, onClose, data }) {
  if (!isOpen) return null;

  const iconType = data.icon || "alert";

  return (
    data.title && (
      <div className="customModal">
        <div className="customModal__content">
          {iconType === "check" && <FaCheck className="color-green" />}
          {iconType === "times" && <FaTimes className="color-red" />}
          {iconType === "alert" && (
            <FaExclamationTriangle className="color-yellow" />
          )}
          <p className="message">{data.message}</p>
          <button className="btn btn__primary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    )
  );
}

Verificacion.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
  }),
};

export function Comprobacion({ isOpen, onClose, data }) {
  if (!isOpen) return null;

  const iconType = data.icon || "alert";

  return (
    data.title && (
      <div className="customModal">
        <div className="customModal__content">
          {iconType === "check" && <FaCheck className="color-green" />}
          {iconType === "times" && <FaTimes className="color-red" />}
          {iconType === "alert" && (
            <FaExclamationTriangle className="color-yellow" />
          )}
          <p className="message">{data.message}</p>
          <button className="btn btn__primary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    )
  );
}

Comprobacion.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
  }),
};

export function Confirmacion({ isOpen, Confirmation, onClose, message }) {
  if (!isOpen) return null;

  return (
    <div className="customModal">
      <div className="customModal__content">
        <FaTimes className="color-red" />
        <p className="message">{message}</p>
        <button className="btn btn__red m-2" onClick={Confirmation}>
          Si
        </button>
        <button className="btn btn__primary m-2" onClick={onClose}>
          No
        </button>
      </div>
    </div>
  );
}

Confirmacion.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  Confirmation: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};
