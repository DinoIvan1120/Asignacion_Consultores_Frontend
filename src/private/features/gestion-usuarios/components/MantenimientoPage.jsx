import { useState } from "react";
import { AddUser } from "../../../../public/modal/gestion-usuarios/AddUser";
import { EditUser } from "../../../../public/modal/gestion-usuarios/EditUser";

export function MantenimientoPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [IsConfirmationDeleteModalOpen, setIsConfirmationDeleteModalOpen] =
    useState(false);

  const handleConfirmationDelete = () => {
    setIsConfirmationDeleteModalOpen(false);
  };

  const handleCancelDelete = () => {
    setIsConfirmationDeleteModalOpen(false);
  };

  return (
    <>
      <section className="headbar headbar--abierto">
        <div className="headbar__title">
          <h3>Mantenimiento de usuarios</h3>
          <p>Edite información de cada usuario registrado</p>
        </div>

        <div className="headbar__acciones"></div>
      </section>
      <section className="bodyFeature">
        <div className="bodyFeature__controls">
          <div className="bodyFeature__controls__actions">
            <button
              className="btn btn__primary btn--ico"
              onClick={() => setIsCreateModalOpen(true)}
            >
              + Crear
            </button>
          </div>
        </div>

        <div>
          <table className="tabla" cellSpacing="0" cellPadding="0">
            <thead>
              <tr>
                <th className="thead col-left">Nombres</th>
                <th className="thead col-left">Apellidos</th>
                <th className="thead col-left"> Correo Electrónico</th>
                <th className="thead col-left">Consultor</th>
                <th className="thead col-left">Editar/Eliminar</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="col-left">Bill</td>
                <td className="col-left">Gates</td>
                <td className="col-left">Microsoft@hotmail.com</td>
                <td className="col-left">Dino Iván Pérez Vásquez</td>
                <td>
                  <button
                    className="btn btn__simple"
                    onClick={() => setIsUpdateModalOpen(true)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button
                    className="btn btn__simple"
                    onClick={() => setIsConfirmationDeleteModalOpen(true)}
                  >
                    <i className="bi bi-trash3"></i>
                  </button>
                </td>
              </tr>

              <tr>
                <td className="col-left">Bill</td>
                <td className="col-left">Gates</td>
                <td className="col-left">Microsoft@hotmail.com</td>
                <td className="col-left">Dino Iván Pérez Vásquez</td>

                <td>
                  <button className="btn btn__simple">
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button className="btn btn__simple">
                    <i className="bi bi-trash3"></i>
                  </button>
                </td>
              </tr>

              <tr>
                <td className="col-left">Bill</td>
                <td className="col-left">Gates</td>
                <td className="col-left">Microsoft@hotmail.com</td>
                <td className="col-left">Dino Iván Pérez Vásquez</td>

                <td>
                  <button className="btn btn__simple">
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button className="btn btn__simple">
                    <i className="bi bi-trash3"></i>
                  </button>
                </td>
              </tr>

              <tr>
                <td className="col-left">Bill</td>
                <td className="col-left">Gates</td>
                <td className="col-left">Microsoft@hotmail.com</td>
                <td className="col-left">Dino Iván Pérez Vásquez</td>

                <td>
                  <button className="btn btn__simple">
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button className="btn btn__simple">
                    <i className="bi bi-trash3"></i>
                  </button>
                </td>
              </tr>

              <tr>
                <td className="col-left">Bill</td>
                <td className="col-left">Gates</td>
                <td className="col-left">Microsoft@hotmail.com</td>
                <td className="col-left">Dino Iván Pérez Vásquez</td>
                <td>
                  <button className="btn btn__simple">
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button className="btn btn__simple">
                    <i className="bi bi-trash3"></i>
                  </button>
                </td>
              </tr>

              <tr>
                <td className="col-left">Bill</td>
                <td className="col-left">Gates</td>
                <td className="col-left">Microsoft@hotmail.com</td>
                <td className="col-left">Dino Iván Pérez Vásquez</td>
                <td>
                  <button className="btn btn__simple">
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button className="btn btn__simple">
                    <i className="bi bi-trash3"></i>
                  </button>
                </td>
              </tr>
              <tr>
                <td className="col-left">Bill</td>
                <td className="col-left">Gates</td>
                <td className="col-left">Microsoft@hotmail.com</td>
                <td className="col-left">Dino Iván Pérez Vásquez</td>

                <td>
                  <button className="btn btn__simple">
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button className="btn btn__simple">
                    <i className="bi bi-trash3"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {isCreateModalOpen && (
          <AddUser onClose={() => setIsCreateModalOpen(false)} />
        )}

        {isUpdateModalOpen && (
          <EditUser onClose={() => setIsUpdateModalOpen(false)} />
        )}

        {IsConfirmationDeleteModalOpen && (
          <div className="confirmation-modal">
            <div className="confirmation-modal__content">
              <h3>
                ¿Está seguro de eliminar
                <br /> el usuario?
              </h3>

              <button
                className="m-2 btn btn__red"
                onClick={handleConfirmationDelete}
              >
                Sí
              </button>
              <button
                className="m-2 btn btn__primary"
                onClick={handleCancelDelete}
              >
                No
              </button>
            </div>
          </div>
        )}

        <div></div>
      </section>
    </>
  );
}
