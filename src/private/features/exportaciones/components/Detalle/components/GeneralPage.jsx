// src/pages/features/seguimiento/sgr/general/GeneralPage.jsx
import { useSearchParams } from "react-router-dom";
import "../../../../../../styles/global/button.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../../../contexts/Authutils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Verificacion } from "../../../../../../public/modal/Modals";
import { modalMessages } from "../../../../../../config/modalMessages";

// 🔥 IMPORTAR SERVICIOS
import {
  GetAsignacionCompleta,
  UpdateAsignacionCompleta,
} from "../../../../../../services/detalleasignaciones/asignacionesupdate.js";

// 🔥 IMPORTAR SERVICIOS DE AUTOCOMPLETADO (reutilizados de PedidosPage)
import { FindAllNameCompany } from "../../../../../../services/asignaciones/Empresa.js";
import { FindAllConsultoresActivos } from "../../../../../../services/asignaciones/Consultores.js";
import { FindAllClientesActivos } from "../../../../../../services/asignaciones/Clientes.js";
import { SearchClientesByNombre } from "../../../../../../services/asignaciones/Clientes.js";
import { SearchConsultoresByNombre } from "../../../../../../services/asignaciones/Consultores.js";

export function GeneralPage() {
  const [searchParams] = useSearchParams();
  const ticket_id = searchParams.get("ticket_id");
  const { accessToken } = useAuth();

  // ============================================
  // ESTADOS PRINCIPALES
  // ============================================
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [asignacionData, setAsignacionData] = useState(null);

  // Estados para modales
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});

  // ============================================
  // ESTADOS PARA CAMPOS EDITABLES
  // ============================================
  const [editableFields, setEditableFields] = useState({
    // Requerimiento
    titulo: "",
    detalle: "",
    descripcionEstimacion: "",
    detalleAsignacion: "",
    idEmpresa: null,
    empresaNombre: "",
    idSubfrente: null,
    idUsuario: null,
    usuarioNombre: "",

    // Actividad (solo primera actividad por simplicidad)
    actividadId: null,
    idusuario: null,
    consultorNombre: "",
    fechainicio: "",
    fechafin: "",
    idtipoactividad: null,
    tiemporegular: 0,
    costo: 0,
    facturable: true,
    porcentajeAvance: 0,
  });

  // ============================================
  // ESTADOS PARA AUTOCOMPLETADO - EMPRESAS
  // ============================================
  const [empresas, setEmpresas] = useState([]);
  const [loadingEmpresas, setLoadingEmpresas] = useState(false);
  const [showEmpresaSuggestions, setShowEmpresaSuggestions] = useState(false);

  // ============================================
  // ESTADOS PARA AUTOCOMPLETADO - CONSULTORES
  // ============================================
  const [consultores, setConsultores] = useState([]);
  const [loadingConsultores, setLoadingConsultores] = useState(false);
  const [consultoresPage, setConsultoresPage] = useState(0);
  const [consultoresHasMore, setConsultoresHasMore] = useState(true);
  const [showConsultorSuggestions, setShowConsultorSuggestions] =
    useState(false);
  const [isSearchingConsultores, setIsSearchingConsultores] = useState(false);

  // ============================================
  // ESTADOS PARA AUTOCOMPLETADO - CLIENTES/CONTACTOS
  // ============================================
  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [clientesPage, setClientesPage] = useState(0);
  const [clientesHasMore, setClientesHasMore] = useState(true);
  const [showClienteSuggestions, setShowClienteSuggestions] = useState(false);
  const [isSearchingClientes, setIsSearchingClientes] = useState(false);

  // ============================================
  // CARGAR DATOS INICIALES
  // ============================================
  useEffect(() => {
    if (!ticket_id || !accessToken) return;

    const cargarAsignacion = async () => {
      try {
        setIsLoading(true);
        const response = await GetAsignacionCompleta(accessToken, ticket_id);

        console.log("✅ Asignación cargada:", response);
        setAsignacionData(response);

        // Extraer datos del requerimiento
        const req = response.requerimiento;
        const act =
          response.actividadPlanRealConsultor &&
          response.actividadPlanRealConsultor.length > 0
            ? response.actividadPlanRealConsultor[0]
            : null;

        // Setear campos editables
        setEditableFields({
          // Requerimiento
          titulo: req.titulo || "",
          detalle: req.detalle || "",
          descripcionEstimacion: req.descripcionEstimacion || "",
          detalleAsignacion: req.detalleAsignacion || "",
          idEmpresa: req.idEmpresa || null,
          empresaNombre: req.empresa?.nombrecomercial || "",
          idSubfrente: req.idSubfrente || null,
          idUsuario: req.idUsuario || null,
          usuarioNombre: req.usuario
            ? `${req.usuario.nombres || ""} ${req.usuario.apepaterno || ""} ${
                req.usuario.apematerno || ""
              }`.trim()
            : "",

          // Actividad
          actividadId: act?.id || null,
          idusuario: act?.idusuario || null,
          consultorNombre: act?.usuario
            ? `${act.usuario.nombres || ""} ${act.usuario.apepaterno || ""} ${
                act.usuario.apematerno || ""
              }`.trim()
            : "",
          fechainicio: act?.fechainicio
            ? formatDateForInput(act.fechainicio)
            : "",
          fechafin: act?.fechafin ? formatDateForInput(act.fechafin) : "",
          idtipoactividad: act?.idtipoactividad || null,
          tiemporegular: act?.tiemporegular || 0,
          costo: act?.costo || 0,
          facturable: act?.facturable ?? true,
          porcentajeAvance: act?.porcentajeAvance || 0,
        });
      } catch (error) {
        console.error("❌ Error al cargar asignación:", error);
        setModalData(
          modalMessages.error({
            message:
              error.message ||
              "Error al cargar la información del ticket. Por favor, intente nuevamente.",
          })
        );
        setShowModal(true);
      } finally {
        setIsLoading(false);
      }
    };

    cargarAsignacion();
  }, [ticket_id, accessToken]);

  // ============================================
  // CARGAR EMPRESAS
  // ============================================
  useEffect(() => {
    const loadEmpresas = async () => {
      if (!accessToken) return;

      try {
        setLoadingEmpresas(true);
        const response = await FindAllNameCompany(accessToken);
        setEmpresas(response);
      } catch (error) {
        console.error("Error al cargar empresas:", error);
        setEmpresas([]);
      } finally {
        setLoadingEmpresas(false);
      }
    };

    loadEmpresas();
  }, [accessToken]);

  // ============================================
  // CARGAR CONSULTORES
  // ============================================
  useEffect(() => {
    const loadConsultores = async () => {
      if (!accessToken) return;

      try {
        setLoadingConsultores(true);
        const response = await FindAllConsultoresActivos(accessToken, 0, 20);

        const consultoresData = response.content.map((consultor) => ({
          id: consultor.idUsuario,
          nombreCompleto:
            consultor.nombreCompleto ||
            `${consultor.nombres || ""} ${consultor.apepaterno || ""} ${
              consultor.apematerno || ""
            }`.trim(),
        }));

        setConsultores(consultoresData);
        setConsultoresPage(0);
        setConsultoresHasMore(!response.last);
      } catch (error) {
        console.error("Error al cargar consultores:", error);
        setConsultores([]);
      } finally {
        setLoadingConsultores(false);
      }
    };

    loadConsultores();
  }, [accessToken]);

  // ============================================
  // BÚSQUEDA DE CONSULTORES CON DEBOUNCE
  // ============================================
  useEffect(() => {
    const searchConsultores = async () => {
      if (!accessToken) return;

      if (
        !editableFields.consultorNombre ||
        editableFields.consultorNombre.trim() === ""
      ) {
        try {
          setIsSearchingConsultores(true);
          const response = await FindAllConsultoresActivos(accessToken, 0, 10);

          const consultoresData = response.content.map((consultor) => ({
            id: consultor.idUsuario,
            nombreCompleto:
              consultor.nombreCompleto ||
              `${consultor.nombres || ""} ${consultor.apepaterno || ""} ${
                consultor.apematerno || ""
              }`.trim(),
          }));

          setConsultores(consultoresData);
          setConsultoresPage(0);
          setConsultoresHasMore(!response.last);
        } catch (error) {
          console.error("Error al cargar consultores:", error);
          setConsultores([]);
        } finally {
          setIsSearchingConsultores(false);
        }
        return;
      }

      try {
        setIsSearchingConsultores(true);
        const response = await SearchConsultoresByNombre(
          accessToken,
          editableFields.consultorNombre.trim(),
          0,
          20
        );

        const consultoresData = response.content.map((consultor) => ({
          id: consultor.idUsuario,
          nombreCompleto:
            consultor.nombreCompleto ||
            `${consultor.nombres || ""} ${consultor.apepaterno || ""} ${
              consultor.apematerno || ""
            }`.trim(),
        }));

        setConsultores(consultoresData);
        setConsultoresPage(0);
        setConsultoresHasMore(!response.last);
      } catch (error) {
        console.error("Error al buscar consultores:", error);
        setConsultores([]);
      } finally {
        setIsSearchingConsultores(false);
      }
    };

    const timeoutId = setTimeout(() => {
      searchConsultores();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [editableFields.consultorNombre, accessToken]);

  // ============================================
  // CARGAR CLIENTES
  // ============================================
  useEffect(() => {
    const loadClientes = async () => {
      if (!accessToken) return;

      try {
        setLoadingClientes(true);
        const response = await FindAllClientesActivos(accessToken, 0, 10);

        const clientesData = response.content.map((cliente) => ({
          id: cliente.idUsuario,
          nombreCompleto:
            cliente.nombreCompleto ||
            `${cliente.nombres || ""} ${cliente.apepaterno || ""} ${
              cliente.apematerno || ""
            }`.trim(),
        }));

        setClientes(clientesData);
        setClientesPage(0);
        setClientesHasMore(!response.last);
      } catch (error) {
        console.error("Error al cargar clientes:", error);
        setClientes([]);
      } finally {
        setLoadingClientes(false);
      }
    };

    loadClientes();
  }, [accessToken]);

  // ============================================
  // BÚSQUEDA DE CLIENTES CON DEBOUNCE
  // ============================================
  useEffect(() => {
    const searchClientes = async () => {
      if (!accessToken) return;

      if (
        !editableFields.usuarioNombre ||
        editableFields.usuarioNombre.trim() === ""
      ) {
        try {
          setIsSearchingClientes(true);
          const response = await FindAllClientesActivos(accessToken, 0, 10);

          const clientesData = response.content.map((cliente) => ({
            id: cliente.idUsuario,
            nombreCompleto:
              cliente.nombreCompleto ||
              `${cliente.nombres || ""} ${cliente.apepaterno || ""} ${
                cliente.apematerno || ""
              }`.trim(),
          }));

          setClientes(clientesData);
          setClientesPage(0);
          setClientesHasMore(!response.last);
        } catch (error) {
          console.error("Error al cargar clientes:", error);
          setClientes([]);
        } finally {
          setIsSearchingClientes(false);
        }
        return;
      }

      try {
        setIsSearchingClientes(true);
        const response = await SearchClientesByNombre(
          accessToken,
          editableFields.usuarioNombre.trim(),
          0,
          20
        );

        const clientesData = response.content.map((cliente) => ({
          id: cliente.idUsuario,
          nombreCompleto:
            cliente.nombreCompleto ||
            `${cliente.nombres || ""} ${cliente.apepaterno || ""} ${
              cliente.apematerno || ""
            }`.trim(),
        }));

        setClientes(clientesData);
        setClientesPage(0);
        setClientesHasMore(!response.last);
      } catch (error) {
        console.error("Error al buscar clientes:", error);
        setClientes([]);
      } finally {
        setIsSearchingClientes(false);
      }
    };

    const timeoutId = setTimeout(() => {
      searchClientes();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [editableFields.usuarioNombre, accessToken]);

  // ============================================
  // CARGAR MÁS CONSULTORES (PAGINACIÓN)
  // ============================================
  const loadMoreConsultores = async () => {
    if (!consultoresHasMore || loadingConsultores || isSearchingConsultores)
      return;

    try {
      setLoadingConsultores(true);
      const nextPage = consultoresPage + 1;
      const response = await FindAllConsultoresActivos(
        accessToken,
        nextPage,
        20
      );

      const nuevosConsultores = response.content.map((consultor) => ({
        id: consultor.idUsuario,
        nombreCompleto:
          consultor.nombreCompleto ||
          `${consultor.nombres || ""} ${consultor.apepaterno || ""} ${
            consultor.apematerno || ""
          }`.trim(),
      }));

      setConsultores((prev) => [...prev, ...nuevosConsultores]);
      setConsultoresPage(nextPage);
      setConsultoresHasMore(!response.last);
    } catch (error) {
      console.error("Error al cargar más consultores:", error);
    } finally {
      setLoadingConsultores(false);
    }
  };

  // ============================================
  // CARGAR MÁS CLIENTES (PAGINACIÓN)
  // ============================================
  const loadMoreClientes = async () => {
    if (!clientesHasMore || loadingClientes || isSearchingClientes) return;

    try {
      setLoadingClientes(true);
      const nextPage = clientesPage + 1;
      let response;

      if (
        editableFields.usuarioNombre &&
        editableFields.usuarioNombre.trim() !== ""
      ) {
        response = await SearchClientesByNombre(
          accessToken,
          editableFields.usuarioNombre.trim(),
          nextPage,
          20
        );
      } else {
        response = await FindAllClientesActivos(accessToken, nextPage, 10);
      }

      const nuevosClientes = response.content.map((cliente) => ({
        id: cliente.idUsuario,
        nombreCompleto:
          cliente.nombreCompleto ||
          `${cliente.nombres || ""} ${cliente.apepaterno || ""} ${
            cliente.apematerno || ""
          }`.trim(),
      }));

      setClientes((prev) => [...prev, ...nuevosClientes]);
      setClientesPage(nextPage);
      setClientesHasMore(!response.last);
    } catch (error) {
      console.error("Error al cargar más clientes:", error);
    } finally {
      setLoadingClientes(false);
    }
  };

  // ============================================
  // FUNCIONES AUXILIARES
  // ============================================
  const formatFecha = (timestamp) => {
    if (!timestamp) return "-";
    const date = new Date(timestamp);
    return date.toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateForInput = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDateToISO = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${year}-${month}-${day}T00:00:00`;
  };

  // ============================================
  // MANEJADORES DE CAMBIOS
  // ============================================
  const handleInputChange = (field, value) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ============================================
  // GUARDAR CAMBIOS
  // ============================================
  const handleGuardarCambios = async () => {
    try {
      setIsSaving(true);

      // Construir objeto de actualización
      const datosActualizacion = {};

      // ✅ REQUERIMIENTO
      const requerimientoUpdates = {};
      let hayRequerimientoUpdates = false;

      if (
        editableFields.titulo !== asignacionData.requerimiento.titulo &&
        editableFields.titulo.trim() !== ""
      ) {
        requerimientoUpdates.titulo = editableFields.titulo;
        hayRequerimientoUpdates = true;
      }

      if (editableFields.detalle !== asignacionData.requerimiento.detalle) {
        requerimientoUpdates.detalle = editableFields.detalle;
        hayRequerimientoUpdates = true;
      }

      if (
        editableFields.descripcionEstimacion !==
        asignacionData.requerimiento.descripcionEstimacion
      ) {
        requerimientoUpdates.descripcionEstimacion =
          editableFields.descripcionEstimacion;
        hayRequerimientoUpdates = true;
      }

      if (
        editableFields.detalleAsignacion !==
        asignacionData.requerimiento.detalleAsignacion
      ) {
        requerimientoUpdates.detalleAsignacion =
          editableFields.detalleAsignacion;
        hayRequerimientoUpdates = true;
      }

      if (hayRequerimientoUpdates) {
        datosActualizacion.requerimiento = requerimientoUpdates;
      }

      // ✅ ACTIVIDADES
      const actividadesUpdates = [];
      const actividadOriginal =
        asignacionData.actividadPlanRealConsultor &&
        asignacionData.actividadPlanRealConsultor.length > 0
          ? asignacionData.actividadPlanRealConsultor[0]
          : null;

      if (actividadOriginal && editableFields.actividadId) {
        const actividadUpdate = {
          id: editableFields.actividadId,
        };
        let hayActividadUpdates = false;

        if (
          editableFields.idusuario !== null &&
          editableFields.idusuario !== actividadOriginal.idusuario
        ) {
          actividadUpdate.idusuario = editableFields.idusuario;
          hayActividadUpdates = true;
        }

        const fechaInicioISO = formatDateToISO(editableFields.fechainicio);
        const fechaInicioOriginal = actividadOriginal.fechainicio
          ? formatDateToISO(formatDateForInput(actividadOriginal.fechainicio))
          : "";
        if (fechaInicioISO !== fechaInicioOriginal) {
          actividadUpdate.fechainicio = fechaInicioISO;
          hayActividadUpdates = true;
        }

        const fechaFinISO = formatDateToISO(editableFields.fechafin);
        const fechaFinOriginal = actividadOriginal.fechafin
          ? formatDateToISO(formatDateForInput(actividadOriginal.fechafin))
          : "";
        if (fechaFinISO !== fechaFinOriginal) {
          actividadUpdate.fechafin = fechaFinISO;
          hayActividadUpdates = true;
        }

        if (editableFields.tiemporegular !== actividadOriginal.tiemporegular) {
          actividadUpdate.tiemporegular = parseFloat(
            editableFields.tiemporegular
          );
          hayActividadUpdates = true;
        }

        if (editableFields.costo !== actividadOriginal.costo) {
          actividadUpdate.costo = parseFloat(editableFields.costo);
          hayActividadUpdates = true;
        }

        if (
          editableFields.porcentajeAvance !== actividadOriginal.porcentajeAvance
        ) {
          actividadUpdate.porcentajeAvance = parseFloat(
            editableFields.porcentajeAvance
          );
          hayActividadUpdates = true;
        }

        if (hayActividadUpdates) {
          actividadesUpdates.push(actividadUpdate);
        }
      }

      if (actividadesUpdates.length > 0) {
        datosActualizacion.actividades = actividadesUpdates;
      }

      // Validar que hay cambios
      if (
        !datosActualizacion.requerimiento &&
        !datosActualizacion.actividades
      ) {
        setModalData(
          modalMessages.warning({
            message: "No se detectaron cambios para actualizar.",
          })
        );
        setShowModal(true);
        return;
      }

      console.log("📤 Enviando actualización:", datosActualizacion);

      // Llamar al servicio de actualización
      const response = await UpdateAsignacionCompleta(
        accessToken,
        ticket_id,
        datosActualizacion
      );

      console.log("✅ Actualización exitosa:", response);

      // Actualizar el estado local
      setAsignacionData(response);

      // Actualizar los campos editables con la respuesta
      const req = response.requerimiento;
      const act =
        response.actividadPlanRealConsultor &&
        response.actividadPlanRealConsultor.length > 0
          ? response.actividadPlanRealConsultor[0]
          : null;

      setEditableFields({
        titulo: req.titulo || "",
        detalle: req.detalle || "",
        descripcionEstimacion: req.descripcionEstimacion || "",
        detalleAsignacion: req.detalleAsignacion || "",
        idEmpresa: req.idEmpresa || null,
        empresaNombre: req.empresa?.nombrecomercial || "",
        idSubfrente: req.idSubfrente || null,
        idUsuario: req.idUsuario || null,
        usuarioNombre: req.usuario
          ? `${req.usuario.nombres || ""} ${req.usuario.apepaterno || ""} ${
              req.usuario.apematerno || ""
            }`.trim()
          : "",
        actividadId: act?.id || null,
        idusuario: act?.idusuario || null,
        consultorNombre: act?.usuario
          ? `${act.usuario.nombres || ""} ${act.usuario.apepaterno || ""} ${
              act.usuario.apematerno || ""
            }`.trim()
          : "",
        fechainicio: act?.fechainicio
          ? formatDateForInput(act.fechainicio)
          : "",
        fechafin: act?.fechafin ? formatDateForInput(act.fechafin) : "",
        idtipoactividad: act?.idtipoactividad || null,
        tiemporegular: act?.tiemporegular || 0,
        costo: act?.costo || 0,
        facturable: act?.facturable ?? true,
        porcentajeAvance: act?.porcentajeAvance || 0,
      });

      // Mostrar modal de éxito
      setModalData(
        modalMessages.success({
          message: `Ticket #${ticket_id} actualizado exitosamente.`,
        })
      );
      setShowModal(true);

      // Desactivar modo edición
      setIsEditing(false);
    } catch (error) {
      console.error("❌ Error al guardar cambios:", error);
      setModalData(
        modalMessages.error({
          message:
            error.message ||
            "Error al actualizar el ticket. Por favor, intente nuevamente.",
        })
      );
      setShowModal(true);
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================
  // FILTROS PARA AUTOCOMPLETADO
  // ============================================
  const filteredEmpresas = empresas.filter((empresa) =>
    empresa.nombrecomercial
      .toLowerCase()
      .includes(editableFields.empresaNombre.toLowerCase())
  );

  const filteredConsultores = consultores.filter((consultor) =>
    consultor.nombreCompleto
      .toLowerCase()
      .includes(editableFields.consultorNombre.toLowerCase())
  );

  const filteredClientes = clientes.filter((cliente) =>
    cliente.nombreCompleto
      .toLowerCase()
      .includes(editableFields.usuarioNombre.toLowerCase())
  );

  // ============================================
  // RENDER
  // ============================================
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <span>
          <FontAwesomeIcon icon={faSpinner} spin /> Cargando información del
          ticket...
        </span>
      </div>
    );
  }

  if (!asignacionData) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <p>No se encontró información del ticket #{ticket_id}</p>
      </div>
    );
  }

  const req = asignacionData.requerimiento;
  const act =
    asignacionData.actividadPlanRealConsultor &&
    asignacionData.actividadPlanRealConsultor.length > 0
      ? asignacionData.actividadPlanRealConsultor[0]
      : null;

  return (
    <>
      <div className="centrar">
        <h3>Información general - Ticket #{ticket_id}</h3>
        <div className="modif">
          <p>
            <strong>Fecha de creación:</strong> {formatFecha(req.fechaRegistro)}
          </p>
          <p>
            <strong>Código requerimiento:</strong> {req.codRequerimiento || "-"}
          </p>
          <p>
            <strong>Estado:</strong>{" "}
            {req.estadoRequerimiento?.descripcion || "-"}
          </p>
        </div>
      </div>

      <div className="detalle">
        <div className="detalle__body form">
          {/* ========== REQUERIMIENTO ========== */}
          <div className="detalle__body__col--uno">
            <label>Nombre comercial (Empresa)</label>
            <div style={{ position: "relative" }}>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    className="w-100"
                    value={editableFields.empresaNombre}
                    onChange={(e) =>
                      handleInputChange("empresaNombre", e.target.value)
                    }
                    onFocus={() => setShowEmpresaSuggestions(true)}
                    onBlur={() =>
                      setTimeout(() => setShowEmpresaSuggestions(false), 200)
                    }
                    placeholder={
                      loadingEmpresas
                        ? "Cargando empresas..."
                        : "Buscar empresa..."
                    }
                    style={{ paddingRight: "40px" }}
                  />

                  {showEmpresaSuggestions && (
                    <ul
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        maxHeight: "200px",
                        overflowY: "auto",
                        zIndex: 1000,
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      {filteredEmpresas.length > 0 ? (
                        filteredEmpresas.map((empresa) => (
                          <li
                            key={empresa.id}
                            onClick={() => {
                              handleInputChange("idEmpresa", empresa.id);
                              handleInputChange(
                                "empresaNombre",
                                empresa.nombrecomercial
                              );
                              setShowEmpresaSuggestions(false);
                            }}
                            style={{
                              padding: "8px 12px",
                              cursor: "pointer",
                              borderBottom: "1px solid #eee",
                            }}
                            onMouseEnter={(e) =>
                              (e.target.style.backgroundColor = "#f0f0f0")
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.backgroundColor = "white")
                            }
                          >
                            {empresa.nombrecomercial}
                          </li>
                        ))
                      ) : (
                        <li
                          style={{
                            padding: "8px 12px",
                            color: "#999",
                            textAlign: "center",
                          }}
                        >
                          No se encontraron empresas
                        </li>
                      )}
                    </ul>
                  )}
                </>
              ) : (
                <input
                  type="text"
                  value={req.empresa?.nombrecomercial || "-"}
                  className="w-100"
                  readOnly
                />
              )}
            </div>
          </div>

          <div className="detalle__body__col--uno">
            <label>Consultor</label>
            <div style={{ position: "relative" }}>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    className="w-100"
                    value={editableFields.consultorNombre}
                    onChange={(e) =>
                      handleInputChange("consultorNombre", e.target.value)
                    }
                    onFocus={() => setShowConsultorSuggestions(true)}
                    onBlur={() =>
                      setTimeout(() => setShowConsultorSuggestions(false), 200)
                    }
                    placeholder="Buscar consultor..."
                    style={{ paddingRight: "40px" }}
                  />

                  {showConsultorSuggestions && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        maxHeight: "250px",
                        overflowY: "auto",
                        zIndex: 1000,
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      {filteredConsultores.length > 0 ? (
                        <>
                          {filteredConsultores.map((consultor) => (
                            <div
                              key={consultor.id}
                              onClick={() => {
                                handleInputChange("idusuario", consultor.id);
                                handleInputChange(
                                  "consultorNombre",
                                  consultor.nombreCompleto
                                );
                                setShowConsultorSuggestions(false);
                              }}
                              style={{
                                padding: "8px 12px",
                                cursor: "pointer",
                                borderBottom: "1px solid #eee",
                              }}
                              onMouseEnter={(e) =>
                                (e.target.style.backgroundColor = "#f0f0f0")
                              }
                              onMouseLeave={(e) =>
                                (e.target.style.backgroundColor = "white")
                              }
                            >
                              {consultor.nombreCompleto}
                            </div>
                          ))}

                          {consultoresHasMore && (
                            <div
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={loadMoreConsultores}
                              style={{
                                padding: "10px 12px",
                                cursor: "pointer",
                                backgroundColor: "#f8f9fa",
                                textAlign: "center",
                                fontWeight: "bold",
                                color: "#007bff",
                                borderTop: "2px solid #dee2e6",
                              }}
                            >
                              {loadingConsultores
                                ? "Cargando..."
                                : "⬇️ Cargar más consultores"}
                            </div>
                          )}
                        </>
                      ) : (
                        <div
                          style={{
                            padding: "8px 12px",
                            color: "#999",
                            textAlign: "center",
                          }}
                        >
                          No se encontraron consultores
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <input
                  type="text"
                  value={
                    act?.usuario
                      ? `${act.usuario.nombres || ""} ${
                          act.usuario.apepaterno || ""
                        } ${act.usuario.apematerno || ""}`.trim()
                      : "-"
                  }
                  className="w-100"
                  readOnly
                />
              )}
            </div>
          </div>

          <div className="detalle__body__col--uno">
            <label>Cliente (Contacto)</label>
            <div style={{ position: "relative" }}>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    className="w-100"
                    value={editableFields.usuarioNombre}
                    onChange={(e) =>
                      handleInputChange("usuarioNombre", e.target.value)
                    }
                    onFocus={() => setShowClienteSuggestions(true)}
                    onBlur={() =>
                      setTimeout(() => setShowClienteSuggestions(false), 200)
                    }
                    placeholder="Buscar cliente..."
                    style={{ paddingRight: "40px" }}
                  />

                  {showClienteSuggestions && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        maxHeight: "250px",
                        overflowY: "auto",
                        zIndex: 1000,
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      {filteredClientes.length > 0 ? (
                        <>
                          {filteredClientes.map((cliente) => (
                            <div
                              key={cliente.id}
                              onClick={() => {
                                handleInputChange("idUsuario", cliente.id);
                                handleInputChange(
                                  "usuarioNombre",
                                  cliente.nombreCompleto
                                );
                                setShowClienteSuggestions(false);
                              }}
                              style={{
                                padding: "8px 12px",
                                cursor: "pointer",
                                borderBottom: "1px solid #eee",
                              }}
                              onMouseEnter={(e) =>
                                (e.target.style.backgroundColor = "#f0f0f0")
                              }
                              onMouseLeave={(e) =>
                                (e.target.style.backgroundColor = "white")
                              }
                            >
                              {cliente.nombreCompleto}
                            </div>
                          ))}

                          {clientesHasMore && (
                            <div
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={loadMoreClientes}
                              style={{
                                padding: "10px 12px",
                                cursor: "pointer",
                                backgroundColor: "#f8f9fa",
                                textAlign: "center",
                                fontWeight: "bold",
                                color: "#007bff",
                                borderTop: "2px solid #dee2e6",
                              }}
                            >
                              {loadingClientes
                                ? "Cargando..."
                                : "⬇️ Cargar más clientes"}
                            </div>
                          )}
                        </>
                      ) : (
                        <div
                          style={{
                            padding: "8px 12px",
                            color: "#999",
                            textAlign: "center",
                          }}
                        >
                          No se encontraron clientes
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <input
                  type="text"
                  value={
                    req.usuario
                      ? `${req.usuario.nombres || ""} ${
                          req.usuario.apepaterno || ""
                        } ${req.usuario.apematerno || ""}`.trim()
                      : "-"
                  }
                  className="w-100"
                  readOnly
                />
              )}
            </div>
          </div>

          {/* ========== ACTIVIDAD ========== */}
          <div className="detalle__body__col--uno">
            <label>Fecha de inicio</label>
            <div>
              {isEditing ? (
                <input
                  type="date"
                  className="w-100"
                  value={editableFields.fechainicio}
                  onChange={(e) =>
                    handleInputChange("fechainicio", e.target.value)
                  }
                />
              ) : (
                <input
                  type="text"
                  value={formatFecha(act?.fechainicio) || "-"}
                  className="w-100"
                  readOnly
                />
              )}
            </div>
          </div>

          <div className="detalle__body__col--uno">
            <label>Fecha final</label>
            <div>
              {isEditing ? (
                <input
                  type="date"
                  className="w-100"
                  value={editableFields.fechafin}
                  onChange={(e) =>
                    handleInputChange("fechafin", e.target.value)
                  }
                />
              ) : (
                <input
                  type="text"
                  value={formatFecha(act?.fechafin) || "-"}
                  className="w-100"
                  readOnly
                />
              )}
            </div>
          </div>

          <div className="detalle__body__col--uno">
            <label>Moneda</label>
            <div>
              <input
                type="text"
                value={req.empresa?.moneda?.descripcion || "-"}
                className="w-100"
                readOnly
              />
            </div>
          </div>

          <div className="detalle__body__col--uno">
            <label>Costo</label>
            <div>
              {isEditing ? (
                <input
                  type="number"
                  className="w-100"
                  value={editableFields.costo}
                  onChange={(e) => handleInputChange("costo", e.target.value)}
                  step="0.01"
                  min="0"
                />
              ) : (
                <input
                  type="text"
                  value={act?.costo?.toFixed(2) || "0.00"}
                  className="w-100"
                  readOnly
                />
              )}
            </div>
          </div>

          <div className="detalle__body__col--uno">
            <label>Horas</label>
            <div>
              {isEditing ? (
                <input
                  type="number"
                  className="w-100"
                  value={editableFields.tiemporegular}
                  onChange={(e) =>
                    handleInputChange("tiemporegular", e.target.value)
                  }
                  step="0.1"
                  min="0"
                />
              ) : (
                <input
                  type="text"
                  value={act?.tiemporegular || "0"}
                  className="w-100"
                  readOnly
                />
              )}
            </div>
          </div>

          <div className="detalle__body__col--uno">
            <label>Detalle Asignación</label>
            <div>
              {isEditing ? (
                <textarea
                  className="w-100"
                  value={editableFields.detalleAsignacion}
                  onChange={(e) =>
                    handleInputChange("detalleAsignacion", e.target.value)
                  }
                  rows="3"
                />
              ) : (
                <textarea
                  value={req.detalleAsignacion || "-"}
                  className="w-100"
                  readOnly
                  rows="3"
                />
              )}
            </div>
          </div>

          <div className="detalle__body__col--uno">
            <label>Descripción Estimación</label>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  className="w-100"
                  value={editableFields.descripcionEstimacion}
                  onChange={(e) =>
                    handleInputChange("descripcionEstimacion", e.target.value)
                  }
                />
              ) : (
                <input
                  type="text"
                  value={req.descripcionEstimacion || "-"}
                  className="w-100"
                  readOnly
                />
              )}
            </div>
          </div>

          <div className="detalle__body__col--uno">
            <label>Avance (%)</label>
            <div>
              {isEditing ? (
                <input
                  type="number"
                  className="w-100"
                  value={editableFields.porcentajeAvance}
                  onChange={(e) =>
                    handleInputChange("porcentajeAvance", e.target.value)
                  }
                  step="0.1"
                  min="0"
                  max="100"
                />
              ) : (
                <input
                  type="text"
                  value={`${act?.porcentajeAvance || 0}%`}
                  className="w-100"
                  readOnly
                />
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="text-center block-center">
            {!isEditing && (
              <button
                className="btn btn__primary btn--ico m-2"
                onClick={() => setIsEditing(true)}
              >
                <i className="bi bi-pencil-square"></i> Editar
              </button>
            )}
            {isEditing && (
              <>
                <button
                  className="btn btn__primary btn--ico m-2"
                  onClick={handleGuardarCambios}
                  disabled={isSaving}
                >
                  <i className="bi bi-check-square"></i>
                  {isSaving ? (
                    <span>
                      <FontAwesomeIcon icon={faSpinner} spin /> Guardando...
                    </span>
                  ) : (
                    "Guardar Cambios"
                  )}
                </button>
                <button
                  className="btn btn__secondary btn--ico m-2"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  <i className="bi bi-x"></i> Cancelar
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      <Verificacion
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        data={modalData}
      />
    </>
  );
}
