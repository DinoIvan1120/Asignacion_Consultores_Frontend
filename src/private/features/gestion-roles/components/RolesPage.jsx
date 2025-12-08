import { useState } from "react";
import { AddRole } from "../../../../public/modal/gestion-roles/AddRole";
import { EditRole } from "../../../../public/modal/gestion-roles/EditRole";

export function RolesPage() {
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
          <h3>Gestión de Roles</h3>
          <p>Agregue usuarios por rol</p>
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
          <div className="bodyFeature__controls__filter">
            <button className="btn btn--simple">
              <span>Filtro</span> <em className="icon-element-fitro"></em>
            </button>
          </div>
        </div>
        <div className="bodyFeature__searching form">
          <div className="bodyFeature__searching__input-container">
            <div className="bodyFeature__searching__col__rol">
              <label className="tipo-rol">Tipo de Rol</label>
              <select name="origin">
                <option value="">Seleccione</option>
                <option value="IMPORT">Gestión de usuarios</option>
                <option value="EXPORT">Gestión de roles</option>
                <option value="CLAIM">Gestión de proyectos</option>
              </select>
            </div>
          </div>

          <div className="bodyFeature__searching__buttons">
            <div className="bodyFeature__controls__button">
              <button className="btn btn--ico btn__primary">
                <i className="bi bi-search"></i>
                Buscar
              </button>
            </div>

            <div className="bodyFeature__controls__button">
              <button className="btn btn--ico btn__primary">
                <i className="bi bi-eraser"></i>
                Limpiar
              </button>
            </div>
          </div>
        </div>
        <div>
          <table className="tabla" cellSpacing="0" cellPadding="0">
            <thead>
              <tr>
                <th className="thead col-left"> Nombre de Rol</th>
                <th className="thead col-left"> Tipo de Rol</th>
                <th className="thead col-left"> Usuarios </th>
                <th className="thead col-left">Editar/Eliminar</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="col-left">Administrador</td>
                <td className="col-left">Gestion de usuarios</td>
                <td className="col-left">Dino Iván Pérez Vásqu</td>
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
                <td className="col-left">Administrador</td>
                <td className="col-left">Gestion de usuarios</td>
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
                <td className="col-left">Administrador</td>
                <td className="col-left">Gestion de usuarios</td>
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
                <td className="col-left">Administrador</td>
                <td className="col-left">Gestion de usuarios</td>
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
                <td className="col-left">Administrador</td>
                <td className="col-left">Gestion de usuarios</td>
                <td className="col-left">Dino Iván Pérez </td>
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
          <AddRole onClose={() => setIsCreateModalOpen(false)} />
        )}

        {isUpdateModalOpen && (
          <EditRole onClose={() => setIsUpdateModalOpen(false)} />
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
