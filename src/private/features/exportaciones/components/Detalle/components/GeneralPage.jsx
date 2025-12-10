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

// 🔥 IMPORTAR SERVICIOS DE AUTOCOMPLETADO
import {
  FindAllNameCompany,
  FindClientesByEmpresa,
  FindMonedaByEmpresa,
  FindPaisByEmpresa,
} from "../../../../../../services/asignaciones/Empresa.js";
import { FindAllConsultoresActivos } from "../../../../../../services/asignaciones/Consultores.js";
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

    // Actividad
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

    // Moneda
    monedaId: null,
    monedaDescripcion: "",

    // 🔥 NUEVO: País
    paisId: null,
    paisNombre: "",
  });

  // ============================================
  // ESTADOS PARA AUTOCOMPLETADO - EMPRESAS
  // ============================================
  const [empresas, setEmpresas] = useState([]);
  const [empresasCompletas, setEmpresasCompletas] = useState([]);
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
  const [showClienteSuggestions, setShowClienteSuggestions] = useState(false);

  // ============================================
  // ESTADOS PARA MONEDA
  // ============================================
  const [loadingMoneda, setLoadingMoneda] = useState(false);
  const [loadingPais, setLoadingPais] = useState(false); // 🔥 NUEVO

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
        const act = response.actividadPlanRealConsultor?.[0] || null;

        // Setear campos editables
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
            ? `${req.usuario.nombres || ""} ${req.usuario.apepaterno || ""} ${req.usuario.apematerno || ""}`.trim()
            : "",
          actividadId: act?.id || null,
          idusuario: act?.idusuario || null,
          consultorNombre: act?.usuario
            ? `${act.usuario.nombres || ""} ${act.usuario.apepaterno || ""} ${act.usuario.apematerno || ""}`.trim()
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
          monedaId: req.empresa?.moneda?.id || null,
          monedaDescripcion: req.empresa?.moneda?.descripcion || "",

          // 🔥 NUEVO: País inicial
          paisId: req.paisNombre?.id || null,
          paisNombre: req.paisNombre?.nombre || "",
        });
      } catch (error) {
        console.error("❌ Error al cargar asignación:", error);
        setModalData(
          modalMessages.error({
            message:
              error.message || "Error al cargar la información del ticket.",
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
        setEmpresasCompletas(response);
        setEmpresas(response.map((emp) => emp.nombrecomercial));
        console.log("Empresas cargadas:", response);
      } catch (error) {
        console.error("Error al cargar empresas:", error);
        setEmpresas([]);
        setEmpresasCompletas([]);
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
            `${consultor.nombres || ""} ${consultor.apepaterno || ""} ${consultor.apematerno || ""}`.trim(),
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
      if (!accessToken || !isEditing) return;

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
              `${consultor.nombres || ""} ${consultor.apepaterno || ""} ${consultor.apematerno || ""}`.trim(),
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
            `${consultor.nombres || ""} ${consultor.apepaterno || ""} ${consultor.apematerno || ""}`.trim(),
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
  }, [editableFields.consultorNombre, accessToken, isEditing]);

  // ============================================
  // CARGAR CLIENTES POR EMPRESA
  // ============================================
  useEffect(() => {
    const loadClientesPorEmpresa = async () => {
      if (!accessToken || !editableFields.idEmpresa || !isEditing) {
        setClientes([]);
        return;
      }

      try {
        setLoadingClientes(true);
        console.log(
          "🔍 Cargando clientes para empresa ID:",
          editableFields.idEmpresa
        );

        const response = await FindClientesByEmpresa(
          accessToken,
          editableFields.idEmpresa
        );

        const clientesFormateados = response.map((cliente) => ({
          id: cliente.idUsuario,
          nombreCompleto: cliente.nombreCompleto || "-",
        }));

        setClientes(clientesFormateados);
        console.log("✅ Clientes cargados:", clientesFormateados);
      } catch (error) {
        console.error("❌ Error al cargar clientes por empresa:", error);
        setClientes([]);
      } finally {
        setLoadingClientes(false);
      }
    };

    loadClientesPorEmpresa();
  }, [accessToken, editableFields.idEmpresa, isEditing]);

  // ============================================
  // CARGAR MONEDA POR EMPRESA
  // ============================================
  useEffect(() => {
    const loadMonedaByEmpresa = async () => {
      if (!accessToken || !editableFields.idEmpresa || !isEditing) return;

      try {
        setLoadingMoneda(true);
        console.log(
          "🔍 Cargando moneda para empresa ID:",
          editableFields.idEmpresa
        );

        const response = await FindMonedaByEmpresa(
          accessToken,
          editableFields.idEmpresa
        );

        setEditableFields((prev) => ({
          ...prev,
          monedaId: response.idmoneda,
          monedaDescripcion: response.descripcion,
        }));

        console.log("✅ Moneda cargada:", response);
      } catch (error) {
        console.error("❌ Error al cargar moneda por empresa:", error);
        setEditableFields((prev) => ({
          ...prev,
          monedaId: null,
          monedaDescripcion: "",
        }));
      } finally {
        setLoadingMoneda(false);
      }
    };

    loadMonedaByEmpresa();
  }, [accessToken, editableFields.idEmpresa, isEditing]);

  // ============================================
  // 🔥 NUEVO: CARGAR PAÍS POR EMPRESA
  // ============================================
  useEffect(() => {
    const loadPaisByEmpresa = async () => {
      if (!accessToken || !editableFields.idEmpresa || !isEditing) return;

      try {
        setLoadingPais(true);
        console.log(
          "🔍 Cargando país para empresa ID:",
          editableFields.idEmpresa
        );

        const response = await FindPaisByEmpresa(
          accessToken,
          editableFields.idEmpresa
        );

        setEditableFields((prev) => ({
          ...prev,
          paisId: response.idPais,
          paisNombre: response.nombre,
        }));

        console.log("✅ País cargado:", response);
      } catch (error) {
        console.error("❌ Error al cargar país por empresa:", error);
        setEditableFields((prev) => ({
          ...prev,
          paisId: null,
          paisNombre: "",
        }));
      } finally {
        setLoadingPais(false);
      }
    };

    loadPaisByEmpresa();
  }, [accessToken, editableFields.idEmpresa, isEditing]);

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
          `${consultor.nombres || ""} ${consultor.apepaterno || ""} ${consultor.apematerno || ""}`.trim(),
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
  // FUNCIONES AUXILIARES - CORREGIDAS PARA UTC
  // ============================================
  const formatFecha = (timestamp) => {
    if (!timestamp) return "-";
    const date = new Date(timestamp);
    // 🔥 USAR UTC para evitar problemas de zona horaria
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateForInput = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    // 🔥 USAR UTC para evitar que reste un día
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDateToISO = (dateString) => {
    if (!dateString) return "";
    // 🔥 Mantener la fecha exacta sin conversión de zona horaria
    const [year, month, day] = dateString.split("-");
    return `${year}-${month}-${day}T00:00:00`;
  };

  // 🔥 NUEVA FUNCIÓN: Comparar fechas sin zona horaria
  const areDatesEqual = (date1, date2) => {
    if (!date1 && !date2) return true;
    if (!date1 || !date2) return false;

    // Extraer solo la parte de fecha (YYYY-MM-DD)
    const d1 = formatDateForInput(date1);
    const d2 = formatDateForInput(date2);

    return d1 === d2;
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

  // 🔥 MANEJADOR ESPECIAL PARA SELECCIÓN DE EMPRESA
  const handleEmpresaSelect = (nombreEmpresa) => {
    const empresaEncontrada = empresasCompletas.find(
      (emp) => emp.nombrecomercial === nombreEmpresa
    );

    if (empresaEncontrada) {
      console.log("🏢 Empresa seleccionada:", empresaEncontrada);

      setEditableFields((prev) => ({
        ...prev,
        empresaNombre: nombreEmpresa,
        idEmpresa: empresaEncontrada.id,
        // 🔥 RESETEAR CONTACTO AL CAMBIAR EMPRESA
        usuarioNombre: "",
        idUsuario: null,
      }));

      setShowEmpresaSuggestions(false);
    }
  };

  // ============================================
  // FUNCIÓN CORREGIDA PARA GUARDAR CAMBIOS
  // ============================================
  const handleGuardarCambios = async () => {
    try {
      setIsSaving(true);

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

      // 🔥 VERIFICAR CAMBIOS EN EMPRESA
      if (
        editableFields.idEmpresa !== asignacionData.requerimiento.idEmpresa &&
        editableFields.idEmpresa !== null
      ) {
        requerimientoUpdates.idEmpresa = editableFields.idEmpresa;
        hayRequerimientoUpdates = true;
      }

      // 🔥 VERIFICAR CAMBIOS EN USUARIO/CONTACTO
      if (
        editableFields.idUsuario !== asignacionData.requerimiento.idUsuario &&
        editableFields.idUsuario !== null
      ) {
        requerimientoUpdates.idUsuario = editableFields.idUsuario;
        hayRequerimientoUpdates = true;
      }

      if (hayRequerimientoUpdates) {
        datosActualizacion.requerimiento = requerimientoUpdates;
      }

      // ✅ ACTIVIDADES
      const actividadesUpdates = [];
      const actividadOriginal =
        asignacionData.actividadPlanRealConsultor?.[0] || null;

      if (actividadOriginal && editableFields.actividadId) {
        const actividadUpdate = { id: editableFields.actividadId };
        let hayActividadUpdates = false;

        if (
          editableFields.idusuario !== null &&
          editableFields.idusuario !== actividadOriginal.idusuario
        ) {
          actividadUpdate.idusuario = editableFields.idusuario;
          hayActividadUpdates = true;
        }

        // 🔍 LOGS DE DEBUG DETALLADOS
        console.log("🔍 DEBUG - Datos de fechas:");
        console.log("  actividadOriginal completo:", actividadOriginal);
        console.log(
          "  actividadOriginal.fechainicio:",
          actividadOriginal.fechainicio
        );
        console.log(
          "  actividadOriginal.fechafin:",
          actividadOriginal.fechafin
        );
        console.log(
          "  editableFields.fechainicio:",
          editableFields.fechainicio
        );
        console.log("  editableFields.fechafin:", editableFields.fechafin);

        // 🔥 COMPARACIÓN DE FECHAS CORREGIDA
        // Comparar directamente los valores del input (YYYY-MM-DD) con las fechas originales formateadas
        const fechaInicioInput = editableFields.fechainicio; // Ya está en formato YYYY-MM-DD
        const fechaInicioOriginal = actividadOriginal.fechainicio
          ? formatDateForInput(actividadOriginal.fechainicio)
          : "";

        console.log("  fechaInicioInput (del formulario):", fechaInicioInput);
        console.log("  fechaInicioOriginal (formateada):", fechaInicioOriginal);
        console.log(
          "  ¿Son iguales?:",
          fechaInicioInput === fechaInicioOriginal
        );

        if (fechaInicioInput !== fechaInicioOriginal) {
          const isoDate = formatDateToISO(fechaInicioInput);
          actividadUpdate.fechainicio = isoDate;
          hayActividadUpdates = true;
          console.log("✅ Fecha inicio CAMBIÓ:");
          console.log("   Original:", fechaInicioOriginal);
          console.log("   Nueva:", fechaInicioInput);
          console.log("   ISO enviado:", isoDate);
        } else {
          console.log("⏭️ Fecha inicio SIN CAMBIOS");
        }

        const fechaFinInput = editableFields.fechafin; // Ya está en formato YYYY-MM-DD
        const fechaFinOriginal = actividadOriginal.fechafin
          ? formatDateForInput(actividadOriginal.fechafin)
          : "";

        console.log("  fechaFinInput (del formulario):", fechaFinInput);
        console.log("  fechaFinOriginal (formateada):", fechaFinOriginal);
        console.log("  ¿Son iguales?:", fechaFinInput === fechaFinOriginal);

        if (fechaFinInput !== fechaFinOriginal) {
          const isoDate = formatDateToISO(fechaFinInput);
          actividadUpdate.fechafin = isoDate;
          hayActividadUpdates = true;
          console.log("✅ Fecha fin CAMBIÓ:");
          console.log("   Original:", fechaFinOriginal);
          console.log("   Nueva:", fechaFinInput);
          console.log("   ISO enviado:", isoDate);
        } else {
          console.log("⏭️ Fecha fin SIN CAMBIOS");
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

      // 🔥 VALIDAR QUE HAY CAMBIOS
      if (
        !datosActualizacion.requerimiento &&
        !datosActualizacion.actividades
      ) {
        setModalData(
          modalMessages.error({
            message: "No se encontraron cambios para guardar.",
          })
        );
        setShowModal(true);
        setIsSaving(false);
        return;
      }

      console.log("📤 Enviando actualización:", datosActualizacion);

      // 1️⃣ ENVIAR LA ACTUALIZACIÓN
      await UpdateAsignacionCompleta(
        accessToken,
        ticket_id,
        datosActualizacion
      );

      console.log("✅ Actualización enviada correctamente");

      // 2️⃣ OBTENER DATOS FRESCOS DEL BACKEND
      console.log("🔄 Recargando datos completos...");
      const responseCompleta = await GetAsignacionCompleta(
        accessToken,
        ticket_id
      );

      console.log("✅ Datos frescos obtenidos:", responseCompleta);
      setAsignacionData(responseCompleta);

      // 3️⃣ ACTUALIZAR CAMPOS EDITABLES CON LOS DATOS FRESCOS
      const req = responseCompleta.requerimiento;
      const act = responseCompleta.actividadPlanRealConsultor?.[0] || null;

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
          ? `${req.usuario.nombres || ""} ${req.usuario.apepaterno || ""} ${req.usuario.apematerno || ""}`.trim()
          : "",
        actividadId: act?.id || null,
        idusuario: act?.idusuario || null,
        consultorNombre: act?.usuario
          ? `${act.usuario.nombres || ""} ${act.usuario.apepaterno || ""} ${act.usuario.apematerno || ""}`.trim()
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
        monedaId: req.empresa?.moneda?.id || null,
        monedaDescripcion: req.empresa?.moneda?.descripcion || "",

        // 🔥 ACTUALIZAR PAÍS
        paisId: req.paisNombre?.id || null,
        paisNombre: req.paisNombre?.nombre || "",
      });

      // 4️⃣ RECARGAR CLIENTES SI HAY EMPRESA
      if (req.idEmpresa) {
        try {
          console.log("🔄 Recargando clientes para empresa:", req.idEmpresa);
          const clientesResponse = await FindClientesByEmpresa(
            accessToken,
            req.idEmpresa
          );

          const clientesFormateados = clientesResponse.map((cliente) => ({
            id: cliente.idUsuario,
            nombreCompleto: cliente.nombreCompleto || "-",
          }));

          setClientes(clientesFormateados);
          console.log("✅ Clientes actualizados:", clientesFormateados.length);
        } catch (error) {
          console.error("❌ Error al recargar clientes:", error);
          setClientes([]);
        }
      }

      // 5️⃣ ACTUALIZAR CONSULTOR EN LA LISTA SI ES NECESARIO
      if (act?.usuario && act.idusuario) {
        const nombreCompletoConsultor =
          typeof act.usuario === "string"
            ? act.usuario
            : `${act.usuario.nombres || ""} ${act.usuario.apepaterno || ""} ${act.usuario.apematerno || ""}`.trim();

        const consultorExiste = consultores.some((c) => c.id === act.idusuario);

        if (!consultorExiste) {
          console.log(
            "🔄 Agregando consultor a la lista:",
            nombreCompletoConsultor
          );
          const nuevoConsultor = {
            id: act.idusuario,
            nombreCompleto: nombreCompletoConsultor,
          };
          setConsultores((prev) => [nuevoConsultor, ...prev]);
        }
      }

      console.log("✅ UI actualizada con datos frescos");
      console.log("📊 Datos finales:", {
        empresa: req.empresa?.nombrecomercial,
        consultor: act?.usuario,
        cliente: req.usuario
          ? `${req.usuario.nombres || ""} ${req.usuario.apepaterno || ""}`.trim()
          : "-",
        moneda: req.empresa?.moneda?.descripcion,
      });

      setModalData(
        modalMessages.success({
          message: `Ticket ${ticket_id} actualizado exitosamente.`,
        })
      );
      setShowModal(true);
      setIsEditing(false);
    } catch (error) {
      console.error("❌ Error al guardar cambios:", error);
      setModalData(
        modalMessages.error({
          message: error.message || "Error al actualizar el ticket.",
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
    empresa.toLowerCase().includes(editableFields.empresaNombre.toLowerCase())
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
  const act = asignacionData.actividadPlanRealConsultor?.[0] || null;

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
          {/* ========== EMPRESA ========== */}
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
                        filteredEmpresas.map((empresa, index) => (
                          <li
                            key={index}
                            onClick={() => handleEmpresaSelect(empresa)}
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
                            {empresa}
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

          {/* ========== CONSULTOR ========== */}
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
                      ? `${act.usuario.nombres || ""} ${act.usuario.apepaterno || ""} ${act.usuario.apematerno || ""}`.trim()
                      : "-"
                  }
                  className="w-100"
                  readOnly
                />
              )}
            </div>
          </div>

          {/* ========== CLIENTE/CONTACTO ========== */}
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
                    placeholder={
                      !editableFields.idEmpresa
                        ? "Seleccione una empresa primero..."
                        : loadingClientes
                          ? "Cargando clientes..."
                          : "Buscar cliente..."
                    }
                    disabled={!editableFields.idEmpresa}
                    style={{ paddingRight: "40px" }}
                  />

                  {showClienteSuggestions && editableFields.idEmpresa && (
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
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      {filteredClientes.length > 0 ? (
                        filteredClientes.map((cliente) => (
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
                        ))
                      ) : (
                        <div
                          style={{
                            padding: "8px 12px",
                            color: "#999",
                            textAlign: "center",
                          }}
                        >
                          {loadingClientes
                            ? "Cargando..."
                            : "No se encontraron clientes"}
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
                      ? `${req.usuario.nombres || ""} ${req.usuario.apepaterno || ""} ${req.usuario.apematerno || ""}`.trim()
                      : "-"
                  }
                  className="w-100"
                  readOnly
                />
              )}
            </div>
          </div>

          {/* ========== FECHA DE INICIO (DATEPICKER) ========== */}
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

          {/* ========== FECHA FINAL (DATEPICKER) ========== */}
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

          {/* ========== MONEDA (AUTOMÁTICA) ========== */}
          <div className="detalle__body__col--uno">
            <label>Moneda</label>
            <div>
              <input
                type="text"
                value={
                  isEditing
                    ? loadingMoneda
                      ? "Cargando moneda..."
                      : editableFields.monedaDescripcion ||
                        "Seleccione una empresa"
                    : req.empresa?.moneda?.descripcion || "-"
                }
                className="w-100"
                readOnly
                style={{ cursor: "not-allowed", backgroundColor: "#f5f5f5" }}
              />
            </div>
          </div>

          {/* ========== COSTO ========== */}
          <div className="detalle__body__col--uno">
            <label>Costo</label>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  className="w-100"
                  value={editableFields.costo}
                  onChange={(e) => handleInputChange("costo", e.target.value)}
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

          {/* ========== HORAS ========== */}
          <div className="detalle__body__col--uno">
            <label>Horas</label>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  className="w-100"
                  value={editableFields.tiemporegular}
                  onChange={(e) =>
                    handleInputChange("tiemporegular", e.target.value)
                  }
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

          {/* ========== DETALLE ASIGNACIÓN ========== */}
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

          {/* ========== DESCRIPCIÓN ESTIMACIÓN ========== */}
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
                  disabled
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

          {/* ========== AVANCE ========== */}
          <div className="detalle__body__col--uno">
            <label>Avance (%)</label>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  className="w-100"
                  value={editableFields.porcentajeAvance}
                  onChange={(e) =>
                    handleInputChange("porcentajeAvance", e.target.value)
                  }
                  disabled
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

          {/* ========== PAÍS (AUTOMÁTICO) 🔥 ========== */}
          <div className="detalle__body__col--uno">
            <label>País</label>
            <div>
              <input
                type="text"
                value={
                  isEditing
                    ? loadingPais
                      ? "Cargando país..."
                      : editableFields.paisNombre || "Seleccione una empresa"
                    : req?.paisNombre?.nombre || "-"
                }
                className="w-100"
                readOnly
                style={{ cursor: "not-allowed", backgroundColor: "#f5f5f5" }}
              />
            </div>
          </div>

          {/* ========== BOTONES DE ACCIÓN ========== */}
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
