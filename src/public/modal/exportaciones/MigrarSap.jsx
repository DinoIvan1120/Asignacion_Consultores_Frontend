import { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
import "../Modals";
import "../../../styles/exportaciones/PedidosPage/MigrarSap.css";

export function MigrarSap({ isOpen, onClose, onMigrarClick }) {
  const [inputPedido, setInputPedido] = useState("");
  const [requestNumber, setRequestNumbers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const [errroMessage, setErrorMessage] = useState("");
  const [numericInputError, setNumericInputError] = useState("");
  const [society_Value, setSociety_Value] = useState("1000");

  const addRangeToRequuestNumbers = () => {
    if (inputPedido.trim() !== "" && requestNumber.length < 5) {
      if (!/^\d+$/.test(inputPedido)) {
        setNumericInputError("Solo se permiten números.");
        return;
      }

      setRequestNumbers([...requestNumber, inputPedido]);
      setInputPedido("");
      setErrorMessage("");
      setNumericInputError("");
      if (requestNumber.length + 1 >= 5) {
        setDisable(true);
      }
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const truncatedInput = inputValue.slice(0, 8);

    setInputPedido(truncatedInput);
    if (inputValue.trim() !== "") {
      setErrorMessage("");
      if (!/^\d+$/.test(inputValue)) {
        setNumericInputError("Solo se permiten números.");
      } else if (truncatedInput.length === 8 && inputPedido.length < 8) {
        setNumericInputError("Solo se permiten 7 números");
      } else {
        setNumericInputError("");
      }
    } else {
      setNumericInputError("");
    }
  };

  const removeRequestNumber = (index) => {
    const updateRequestNumbers = [...requestNumber];
    updateRequestNumbers.splice(index, 1);
    setRequestNumbers(updateRequestNumbers);
    setDisable(false);
  };

  const handleSubmit = async () => {
    if (requestNumber.length === 0) {
      setErrorMessage("Debes agregar al menos un pedido");
      return;
    }

    try {
      setIsLoading(true);
      await onMigrarClick(requestNumber, society_Value);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="customModal">
        <div className="customModal__content">
          <div className="customModal__content-cerrar">
            <button className="customModal__content-button" onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <h2 className="titulo">Migrar Datos</h2>
          <div className="form__group">
            <div className="form__group-items">
              <label className="etiquetas">N° de Sociedad</label>
              <select
                className="selector"
                value={society_Value}
                onChange={(e) => setSociety_Value(e.target.value)}
              >
                <option value="1000">1000</option>
                <option value="2000">2000</option>
              </select>
            </div>

            <div className="form__group-items">
              <label className="etiquetas">Número de pedidos</label>
              <input
                type="text"
                className={`Migrar ${requestNumber.length >= 5 ? "max-reached" : ""}
                        ${inputPedido.length === 7 ? "valid-input" : ""}
                        ${inputPedido.length === 8 ? "invalid-length" : ""}`}
                placeholder="Número de pedido"
                value={inputPedido}
                onChange={handleInputChange}
                disabled={disable}
              ></input>
            </div>

            <button
              className="btn btn__primary btn--ico ta"
              onClick={addRangeToRequuestNumbers}
              disabled={disable || inputPedido.length === 8}
            >
              <i className="bi bi-plus"></i>
              Agregar
            </button>
          </div>

          {numericInputError && (
            <div className="error-message">
              <p>{numericInputError}</p>
            </div>
          )}

          {errroMessage && (
            <div className="error-message">
              <p>{errroMessage}</p>
            </div>
          )}

          <ul className="lista">
            {requestNumber.map((number, index) => (
              <li className="lista-items" key={index}>
                {number}
                <button
                  className="sipnup-btn_agregar_"
                  onClick={() => removeRequestNumber(index)}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>

          <div className="">
            <button
              className="btn btn__primary btn--ico margen"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <span>
                  <FontAwesomeIcon icon={faSpinner} spin /> Migrando...
                </span>
              ) : (
                "Migrar"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

MigrarSap.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onMigrarClick: PropTypes.func.isRequired,
};
