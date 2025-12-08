import "../../../../styles/features/body.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useState } from "react";

export function ReportesPage() {
  const [showFilter, setShowFilter] = useState(true);

  const handlerOnClickFiltro = () => {
    setShowFilter(!showFilter);
  };

  return (
    <>
      <section className="headbar headbar--abierto">
        <div className="headbar__title">
          <h3>Reportes &rarr; Asignaciones</h3>
          <p>Coordinación, control y optimización</p>
        </div>
      </section>

      <section className="bodyFeature">
        <div className="bodyFeature__controls">
          <div className="bodyFeature__controls__actions">
            <button className="btn btn__primary btn--ico">
              <i className="bi bi-cloud-arrow-down-fill"></i>
              Decargar
            </button>
          </div>

          <div className="bodyFeature__controls__filter">
            <button
              value="si"
              className="btn btn--simple"
              onClick={handlerOnClickFiltro}
            >
              <span>Filtro</span> <em className="icon-element-fitro"></em>
            </button>
          </div>
        </div>

        {showFilter && (
          <div className="bodyFeature__searching form">
            <div className="bodyFeature__searching__input-container">
              <div
                className="bodyFeature__searching__col"
                style={{ zIndex: 3 }}
              >
                <label>Fecha inicio</label>
                <DatePicker
                  isClearable
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Selecciona fecha de inicio"
                />
              </div>

              <div
                className="bodyFeature__searching__col"
                style={{ zIndex: 3 }}
              >
                <label>Fecha final</label>
                <DatePicker
                  isClearable
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Selecciona fecha de fin"
                />
              </div>

              <div className="bodyFeature__searching__col">
                <label>Número de tickes</label>
                <input type="text" className="w-100" placeholder="4599" />
              </div>

              <div className="bodyFeature__searching__col">
                <label>Consultor</label>
                <select className="w-100 select">
                  <option value="">Seleccionar</option>
                  <option value="si">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className="bodyFeature__searching__col">
                <label>Cliente</label>
                <select className="w-100 select">
                  <option value="">Seleccionar</option>
                  <option value="1000">1000</option>
                  <option value="2000">2000</option>
                </select>
              </div>

              <div className="bodyFeature__searching__col">
                <label>Estado</label>
                <select className="w-100 select">
                  <option value="">Seleccionar</option>
                  <option value="si">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>

            <div className="bodyFeature__searching__buttons">
              <div className="bodyFeature__controls__button">
                <button className="btn btn__primary btn--ico">
                  <i className="bi bi-search"></i>
                  Buscar
                </button>
              </div>

              <div className="bodyFeature__controls__button">
                <button className="btn btn__primary btn--ico">
                  <i className="bi bi-eraser"></i>
                  Limpiar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="tabla-container">
          <table className="tabla_" cellSpacing="0" cellPadding="0">
            <thead>
              <tr>
                <th className="thead">Posición</th>
                <th className="thead">Fecha de creación</th>
                <th className="thead">Razon social</th>
                <th className="thead">Código requerimiento</th>
                <th className="thead">id..</th>
                <th className="thead">Consultor</th>
                <th className="thead">Estado requerimiento</th>
                <th className="thead">Fecha inicio</th>
                <th className="thead">Fecha final</th>
                <th className="thead">Moneda</th>
                <th className="thead">Monto</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{/* <input type="checkbox" /> */}1</td>
                <td>
                  <strong>09/12/2025</strong>
                </td>
                <td>MITSUI</td>
                <td>MAS-2025-0067</td>
                <td>4599</td>
                <td>DINA ANDREA DE LA JARA CORDERO</td>
                <td>En Ejecución</td>
                <td>09/24/2025</td>
                <td>10/23/2025</td>
                <td>Soles</td>
                <td>7800</td>
              </tr>
              <tr>
                <td>{/* <input type="checkbox" /> */}2</td>
                <td>
                  <strong>09/12/2025</strong>
                </td>
                <td>MITSUI</td>
                <td>MAS-2025-0067</td>
                <td>4599</td>
                <td>DINA ANDREA DE LA JARA CORDERO</td>
                <td>En Ejecución</td>
                <td>09/24/2025</td>
                <td>10/23/2025</td>
                <td>Soles</td>
                <td>7800</td>
              </tr>
              <tr>
                <td>{/* <input type="checkbox" /> */}3</td>
                <td>
                  <strong>09/12/2025</strong>
                </td>
                <td>MITSUI</td>
                <td>MAS-2025-0067</td>
                <td>4599</td>
                <td>DINA ANDREA DE LA JARA CORDERO</td>
                <td>En Ejecución</td>
                <td>09/24/2025</td>
                <td>10/23/2025</td>
                <td>Soles</td>
                <td>7800</td>
              </tr>
              <tr>
                <td>{/* <input type="checkbox" /> */}4</td>
                <td>
                  <strong>09/12/2025</strong>
                </td>
                <td>MITSUI</td>
                <td>MAS-2025-0067</td>
                <td>4599</td>
                <td>DINA ANDREA DE LA JARA CORDERO</td>
                <td>En Ejecución</td>
                <td>09/24/2025</td>
                <td>10/23/2025</td>
                <td>Soles</td>
                <td>7800</td>
              </tr>
              <tr>
                <td>{/* <input type="checkbox" /> */}5</td>
                <td>
                  <strong>09/12/2025</strong>
                </td>
                <td>MITSUI</td>
                <td>MAS-2025-0067</td>
                <td>4599</td>
                <td>DINA ANDREA DE LA JARA CORDERO</td>
                <td>En Ejecución</td>
                <td>09/24/2025</td>
                <td>10/23/2025</td>
                <td>Soles</td>
                <td>7800</td>
              </tr>
              <tr>
                <td>{/* <input type="checkbox" /> */}6</td>
                <td>
                  <strong>09/12/2025</strong>
                </td>
                <td>MITSUI</td>
                <td>MAS-2025-0067</td>
                <td>4599</td>
                <td>DINA ANDREA DE LA JARA CORDERO</td>
                <td>En Ejecución</td>
                <td>09/24/2025</td>
                <td>10/23/2025</td>
                <td>Soles</td>
                <td>7800</td>
              </tr>

              <tr>
                <td>{/* <input type="checkbox" /> */}6</td>
                <td>
                  <strong>09/12/2025</strong>
                </td>
                <td>MITSUI</td>
                <td>MAS-2025-0067</td>
                <td>4599</td>
                <td>DINA ANDREA DE LA JARA CORDERO</td>
                <td>En Ejecución</td>
                <td>09/24/2025</td>
                <td>10/23/2025</td>
                <td>Soles</td>
                <td>7800</td>
              </tr>

              <tr>
                <td>{/* <input type="checkbox" /> */}6</td>
                <td>
                  <strong>09/12/2025</strong>
                </td>
                <td>MITSUI</td>
                <td>MAS-2025-0067</td>
                <td>4599</td>
                <td>DINA ANDREA DE LA JARA CORDERO</td>
                <td>En Ejecución</td>
                <td>09/24/2025</td>
                <td>10/23/2025</td>
                <td>Soles</td>
                <td>7800</td>
              </tr>

              <tr>
                <td>{/* <input type="checkbox" /> */}6</td>
                <td>
                  <strong>09/12/2025</strong>
                </td>
                <td>MITSUI</td>
                <td>MAS-2025-0067</td>
                <td>4599</td>
                <td>DINA ANDREA DE LA JARA CORDERO</td>
                <td>En Ejecución</td>
                <td>09/24/2025</td>
                <td>10/23/2025</td>
                <td>Soles</td>
                <td>7800</td>
              </tr>

              <tr>
                <td>{/* <input type="checkbox" /> */}6</td>
                <td>
                  <strong>09/12/2025</strong>
                </td>
                <td>MITSUI</td>
                <td>MAS-2025-0067</td>
                <td>4599</td>
                <td>DINA ANDREA DE LA JARA CORDERO</td>
                <td>En Ejecución</td>
                <td>09/24/2025</td>
                <td>10/23/2025</td>
                <td>Soles</td>
                <td>7800</td>
              </tr>

              <tr>
                <td>{/* <input type="checkbox" /> */}6</td>
                <td>
                  <strong>09/12/2025</strong>
                </td>
                <td>MITSUI</td>
                <td>MAS-2025-0067</td>
                <td>4599</td>
                <td>DINA ANDREA DE LA JARA CORDERO</td>
                <td>En Ejecución</td>
                <td>09/24/2025</td>
                <td>10/23/2025</td>
                <td>Soles</td>
                <td>7800</td>
              </tr>
              <tr>
                <td>{/* <input type="checkbox" /> */}6</td>
                <td>
                  <strong>09/12/2025</strong>
                </td>
                <td>MITSUI</td>
                <td>MAS-2025-0067</td>
                <td>4599</td>
                <td>DINA ANDREA DE LA JARA CORDERO</td>
                <td>En Ejecución</td>
                <td>09/24/2025</td>
                <td>10/23/2025</td>
                <td>Soles</td>
                <td>7800</td>
              </tr>
              <tr>
                <td>{/* <input type="checkbox" /> */}6</td>
                <td>
                  <strong>09/12/2025</strong>
                </td>
                <td>MITSUI</td>
                <td>MAS-2025-0067</td>
                <td>4599</td>
                <td>DINA ANDREA DE LA JARA CORDERO</td>
                <td>En Ejecución</td>
                <td>09/24/2025</td>
                <td>10/23/2025</td>
                <td>Soles</td>
                <td>7800</td>
              </tr>
              <tr>
                <td>{/* <input type="checkbox" /> */}6</td>
                <td>
                  <strong>09/12/2025</strong>
                </td>
                <td>MITSUI</td>
                <td>MAS-2025-0067</td>
                <td>4599</td>
                <td>DINA ANDREA DE LA JARA CORDERO</td>
                <td>En Ejecución</td>
                <td>09/24/2025</td>
                <td>10/23/2025</td>
                <td>Soles</td>
                <td>7800</td>
              </tr>
              <tr>
                <td>{/* <input type="checkbox" /> */}6</td>
                <td>
                  <strong>09/12/2025</strong>
                </td>
                <td>MITSUI</td>
                <td>MAS-2025-0067</td>
                <td>4599</td>
                <td>DINA ANDREA DE LA JARA CORDERO</td>
                <td>En Ejecución</td>
                <td>09/24/2025</td>
                <td>10/23/2025</td>
                <td>Soles</td>
                <td>7800</td>
              </tr>
              <tr>
                <td>{/* <input type="checkbox" /> */}6</td>
                <td>
                  <strong>09/12/2025</strong>
                </td>
                <td>MITSUI</td>
                <td>MAS-2025-0067</td>
                <td>4599</td>
                <td>DINA ANDREA DE LA JARA CORDERO</td>
                <td>En Ejecución</td>
                <td>09/24/2025</td>
                <td>10/23/2025</td>
                <td>Soles</td>
                <td>7800</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
