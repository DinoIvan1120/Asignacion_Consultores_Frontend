// src/pages/features/seguimiento/sgr/actividades/ActividadesPage.jsx
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../../../contexts/Authutils";
import "react-datepicker/dist/react-datepicker.css";
import "../../../../styles/features/body.css";
import DatePicker from "react-datepicker";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FindAllAsignacionesCoordinador } from "../../../../services/detalleasignaciones/listarasignaciones.js";
import {
  extraerNombreConsultor,
  extraerFechaInicio,
  extraerFechaFinal,
} from "../../../../helpers/extraerfechas/ParsearTitulo.js";
import { Verificacion } from "../../../../public/modal/Modals";

// 🔥 IMPORTAR SERVICIOS DE FILTRADO
import { FindAllClientesActivos } from "../../../../services/asignaciones/Clientes.js";
import { SearchClientesByNombre } from "../../../../services/asignaciones/Clientes.js";
import { FindAllConsultoresActivos } from "../../../../services/asignaciones/Consultores.js";
import { SearchConsultoresByNombre } from "../../../../services/asignaciones/Consultores.js";
import { FiltrarAsignaciones } from "../../../../services/detalleasignaciones/filtrarasignaciones.js";
import { FindAllNameCompany } from "../../../../services/asignaciones/Empresa.js";

// 🔥 IMPORTAR HOOKS DE PROCESAMIENTO
import { handleApplyFilterClickAsignaciones } from "../../../../hooks/exportaciones/PedidosPage/FiltrarAsignacionesProcess.js";
import { handleClearFiltersAsignaciones } from "../../../../hooks/exportaciones/PedidosPage/LimpiarFiltrosAsignacionesProcess.js";
import { handleDownloadExcelAsignaciones } from "../../../../hooks/exportaciones/PedidosPage/DownloadExcelReporteActividadesProcess.js";
import { format } from "date-fns";

export function ReportesPage() {
  const { accessToken } = useAuth();

  // ============================================
  // ESTADOS PARA ASIGNACIONES
  // ============================================
  const [asignaciones, setAsignaciones] = useState([]);
  const [loadingAsignaciones, setLoadingAsignaciones] = useState(false);
  const [asignacionesPage, setAsignacionesPage] = useState(0);
  const [asignacionesHasMore, setAsignacionesHasMore] = useState(true);
  const [totalAsignaciones, setTotalAsignaciones] = useState(0);
  const [asignacionesCargadas, setAsignacionesCargadas] = useState(0);
  const [ultimaCargaCantidad, setUltimaCargaCantidad] = useState(0);

  // ============================================
  // ESTADOS PARA FILTROS
  // ============================================
  const [showFilter, setShowFilter] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [clienteFilter, setClienteFilter] = useState("");
  const [consultorFilter, setConsultorFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingLimpiarFiltros, setLoadingLimpiarFiltros] = useState(false);

  // ============================================
  const [loadingDownload, setLoadingDownload] = useState(false);

  // ============================================
  // 🔥 ESTADOS PARA CLIENTES (COPIADOS DE PEDIDOSPAGE)
  // ============================================
  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [clientesPage, setClientesPage] = useState(0);
  const [clientesHasMore, setClientesHasMore] = useState(true);
  const [showClienteSuggestions, setShowClienteSuggestions] = useState(false);
  const [isSearchingClientes, setIsSearchingClientes] = useState(false);

  // ============================================
  // 🔥 ESTADOS PARA CONSULTORES (COPIADOS DE PEDIDOSPAGE)
  // ============================================
  const [consultores, setConsultores] = useState([]);
  const [loadingConsultores, setLoadingConsultores] = useState(false);
  const [consultoresPage, setConsultoresPage] = useState(0);
  const [consultoresHasMore, setConsultoresHasMore] = useState(true);
  const [showConsultorSuggestions, setShowConsultorSuggestions] =
    useState(false);
  const [isSearchingConsultores, setIsSearchingConsultores] = useState(false);

  //===================

  const [orderNumberFilter, setOrderNumberFilter] = useState("");

  const [showRazonSocialSuggestions, setShowRazonSocialSuggestions] =
    useState(false);

  const [loadingEmpresas, setLoadingEmpresas] = useState(false);
  const [razonesSociales, setRazonesSociales] = useState([]);

  const [empresasCompletas, setEmpresasCompletas] = useState([]); // Guardar empresas con ID

  //Nuevo Filtrar
  useEffect(() => {
    const loadNombresComerciales = async () => {
      if (!accessToken) return;

      try {
        setLoadingEmpresas(true);
        const response = await FindAllNameCompany(accessToken);

        // ✅ Guardar empresas completas (con ID y nombre)
        setEmpresasCompletas(response);

        // Guardar solo nombres para el autocomplete
        const nombres = response.map((empresa) => empresa.nombrecomercial);
        setRazonesSociales(nombres);

        console.log("Empresas completas cargadas:", response);
      } catch (error) {
        console.error("Error al cargar nombres comerciales:", error);
        setRazonesSociales([]);
        setEmpresasCompletas([]);
      } finally {
        setLoadingEmpresas(false);
      }
    };

    loadNombresComerciales();
  }, [accessToken]);

  // Funciones de filtrado para autocompletado
  const filteredRazonesSociales = razonesSociales.filter((razon) =>
    razon.toLowerCase().includes(orderNumberFilter.toLowerCase()),
  );

  // ============================================
  // ESTADOS PARA MODALES
  // ============================================
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});

  // ============================================
  // CONFIGURACIÓN DE FECHAS
  // ============================================
  const minDate = useMemo(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 36);
    return date;
  }, []);

  const maxDate = useMemo(() => new Date(), []);

  const isDateRangeValid = useCallback(
    (startDate, endDate) => {
      const oneYearLater = new Date(startDate);
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
      return startDate <= maxDate && endDate <= oneYearLater;
    },
    [maxDate],
  );

  // ⬇️ FUNCIÓN PARA MANEJAR EL CLICK EN EL BOTÓN DESPLEGABLE
  const handleDropdownClick = () => {
    setShowRazonSocialSuggestions(!showRazonSocialSuggestions);
  };
  // ============================================
  // CARGAR ASIGNACIONES INICIAL
  // ============================================
  useEffect(() => {
    const loadAsignacionesInicial = async () => {
      if (!accessToken) return;

      try {
        setLoadingAsignaciones(true);
        const response = await FindAllAsignacionesCoordinador(
          accessToken,
          0,
          10,
        );

        setAsignaciones(response.content);
        setAsignacionesPage(0);
        setAsignacionesHasMore(!response.last);
        setTotalAsignaciones(response.totalElements);
        setAsignacionesCargadas(response.content.length);
        setUltimaCargaCantidad(response.content.length);

        console.log("✅ Asignaciones cargadas:", response);
      } catch (error) {
        console.error("❌ Error al cargar asignaciones:", error);
        setAsignaciones([]);
      } finally {
        setLoadingAsignaciones(false);
      }
    };

    loadAsignacionesInicial();
  }, [accessToken]);

  // ============================================
  // 🔥 CARGAR CLIENTES INICIAL
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
        console.log("✅ Clientes cargados:", clientesData);
      } catch (error) {
        console.error("❌ Error al cargar clientes:", error);
        setClientes([]);
      } finally {
        setLoadingClientes(false);
      }
    };

    loadClientes();
  }, [accessToken]);

  // ============================================
  // 🔥 CARGAR CONSULTORES INICIAL
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
        console.log("✅ Consultores cargados:", consultoresData);
      } catch (error) {
        console.error("❌ Error al cargar consultores:", error);
        setConsultores([]);
      } finally {
        setLoadingConsultores(false);
      }
    };

    loadConsultores();
  }, [accessToken]);

  // ============================================
  // 🔥 BÚSQUEDA DE CLIENTES CON DEBOUNCE
  // ============================================
  useEffect(() => {
    const searchClientes = async () => {
      if (!accessToken) return;

      // Si el input está vacío, cargar clientes activos normales
      if (!clienteFilter || clienteFilter.trim() === "") {
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

      // Si hay texto en el input, buscar en el backend
      try {
        setIsSearchingClientes(true);
        const response = await SearchClientesByNombre(
          accessToken,
          clienteFilter.trim(),
          0,
          20,
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

        console.log("Clientes encontrados:", clientesData);
      } catch (error) {
        console.error("Error al buscar clientes:", error);
        setClientes([]);
      } finally {
        setIsSearchingClientes(false);
      }
    };

    // Debounce: esperar 500ms después de que el usuario deje de escribir
    const timeoutId = setTimeout(() => {
      searchClientes();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [clienteFilter, accessToken]);

  // ============================================
  // 🔥 BÚSQUEDA DE CONSULTORES CON DEBOUNCE
  // ============================================
  useEffect(() => {
    const searchConsultores = async () => {
      if (!accessToken) return;

      // Si el input está vacío, cargar consultores activos normales
      if (!consultorFilter || consultorFilter.trim() === "") {
        try {
          setIsSearchingConsultores(true);
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
          setIsSearchingConsultores(false);
        }
        return;
      }

      // Si hay texto en el input, buscar en el backend
      try {
        setIsSearchingConsultores(true);
        const response = await SearchConsultoresByNombre(
          accessToken,
          consultorFilter.trim(),
          0,
          20,
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

        console.log("Consultores encontrados:", consultoresData);
      } catch (error) {
        console.error("Error al buscar consultores:", error);
        setConsultores([]);
      } finally {
        setIsSearchingConsultores(false);
      }
    };

    // Debounce: esperar 500ms después de que el usuario deje de escribir
    const timeoutId = setTimeout(() => {
      searchConsultores();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [consultorFilter, accessToken]);

  // ============================================
  // 🔥 CARGAR MÁS ASIGNACIONES (SIMPLIFICADO - SIEMPRE USA FILTRADO)
  // ============================================
  const loadMoreAsignaciones = async () => {
    if (!asignacionesHasMore || loadingAsignaciones) return;

    try {
      setLoadingAsignaciones(true);
      const nextPage = asignacionesPage + 1;

      // ✅ SIEMPRE construir el objeto de filtros (aunque estén vacíos)
      const filtros = {};

      // Fechas
      if (startDate) {
        const year = startDate.getFullYear();
        const month = String(startDate.getMonth() + 1).padStart(2, "0");
        const day = String(startDate.getDate()).padStart(2, "0");
        filtros.fechaInicio = `${year}-${month}-${day}`;
      }
      if (endDate) {
        const year = endDate.getFullYear();
        const month = String(endDate.getMonth() + 1).padStart(2, "0");
        const day = String(endDate.getDate()).padStart(2, "0");
        filtros.fechaFin = `${year}-${month}-${day}`;
      }

      // Cliente (convertir a ID)
      if (clienteFilter) {
        const clienteEncontrado = clientes.find(
          (cliente) =>
            cliente.nombreCompleto.toLowerCase() ===
            clienteFilter.toLowerCase(),
        );
        if (clienteEncontrado) {
          filtros.idUsuario = clienteEncontrado.id;
        }
      }

      // Consultor (enviar nombre)
      if (consultorFilter && consultorFilter.trim() !== "") {
        filtros.nombreConsultor = consultorFilter.trim();
      }

      if (orderNumberFilter && orderNumberFilter.trim() !== "") {
        filtros.nombrecomercial = orderNumberFilter.trim();
      }

      // ✅ SIEMPRE llamar al endpoint de filtrado
      const response = await FiltrarAsignaciones(
        filtros,
        accessToken,
        nextPage,
        10,
      );

      const nuevasAsignaciones = response.content;
      const cantidadNueva = nuevasAsignaciones.length;

      setAsignaciones((prev) => [...prev, ...nuevasAsignaciones]);
      setAsignacionesPage(nextPage);
      setAsignacionesHasMore(!response.last);
      setAsignacionesCargadas((prev) => prev + cantidadNueva);
      setUltimaCargaCantidad(cantidadNueva);

      console.log(`✅ Más asignaciones cargadas: ${cantidadNueva}`);
    } catch (error) {
      console.error("❌ Error al cargar más asignaciones:", error);
    } finally {
      setLoadingAsignaciones(false);
    }
  };

  // ============================================
  // RETROCEDER ASIGNACIONES
  // ============================================
  const retrocederAsignaciones = () => {
    if (asignacionesCargadas <= 10 || asignacionesPage === 0) return;

    const cantidadAEliminar = ultimaCargaCantidad;

    setAsignaciones((prev) => prev.slice(0, -cantidadAEliminar));
    setAsignacionesCargadas((prev) => prev - cantidadAEliminar);
    setAsignacionesPage((prev) => prev - 1);
    setAsignacionesHasMore(true);
    setUltimaCargaCantidad(10);

    console.log(
      `⬅️ Retrocediendo: se eliminaron ${cantidadAEliminar} asignaciones`,
    );
  };

  const formatFechaa = (fecha) => {
    const dia = new Date(fecha).getDate(); // devuelve número (sin cero adelante)
    return dia;
  };

  // ============================================
  // 🔥 CARGAR MÁS CLIENTES
  // ============================================
  const loadMoreClientes = async () => {
    if (!clientesHasMore || loadingClientes || isSearchingClientes) return;

    try {
      setLoadingClientes(true);
      const nextPage = clientesPage + 1;
      let response;

      // Si hay filtro de búsqueda, usar el endpoint de búsqueda
      if (clienteFilter && clienteFilter.trim() !== "") {
        response = await SearchClientesByNombre(
          accessToken,
          clienteFilter.trim(),
          nextPage,
          20,
        );
      } else {
        // Si no hay filtro, usar el endpoint normal
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
  // 🔥 CARGAR MÁS CONSULTORES
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
        20,
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
  // 🔥 HANDLERS DE FILTROS (USANDO HOOKS)
  // ============================================
  const handleApplyFilterClick = useCallback(async () => {
    await handleApplyFilterClickAsignaciones({
      accessToken,
      startDate,
      endDate,
      clienteFilter,
      consultorFilter,
      clientes,
      setAsignaciones,
      setAsignacionesPage,
      setAsignacionesHasMore,
      setTotalAsignaciones,
      setAsignacionesCargadas,
      setUltimaCargaCantidad,
      setLoading,
      setModalData,
      setShowModal,
    });
  }, [
    accessToken,
    startDate,
    endDate,
    clienteFilter,
    consultorFilter,
    clientes,
  ]);

  const handleClearFiltersClick = useCallback(async () => {
    await handleClearFiltersAsignaciones({
      accessToken,
      setStartDate,
      setEndDate,
      setClienteFilter,
      setOrderNumberFilter,
      setConsultorFilter,
      setAsignaciones,
      setAsignacionesPage,
      setAsignacionesHasMore,
      setTotalAsignaciones,
      setAsignacionesCargadas,
      setUltimaCargaCantidad,
      setLoadingLimpiarFiltros,
    });
  }, [accessToken]);

  // ============================================
  const handleDownloadClick = useCallback(async () => {
    await handleDownloadExcelAsignaciones({
      accessToken,
      startDate,
      endDate,
      clienteFilter,
      consultorFilter,
      clientes,
      setLoadingDownload,
      setModalData,
      setShowModal,
    });
  }, [
    accessToken,
    startDate,
    endDate,
    clienteFilter,
    consultorFilter,
    clientes,
  ]);

  // ============================================
  // FILTROS PARA AUTOCOMPLETADO
  // ============================================
  const filteredClientesDropdown = clientes.filter((cliente) =>
    cliente.nombreCompleto.toLowerCase().includes(clienteFilter.toLowerCase()),
  );

  const filteredConsultores = consultores.filter((consultor) =>
    consultor.nombreCompleto
      .toLowerCase()
      .includes(consultorFilter.toLowerCase()),
  );

  // ✅ AHORA (corregido con UTC)
  const formatFecha = (timestamp) => {
    if (!timestamp) return "-";
    const date = new Date(timestamp);
    return date.toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  // 🔥 NUEVA: Formatear fecha para enviar al backend (usa hora local)
  const formatDateForBackend = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handlerOnClickFiltro = () => {
    setShowFilter(!showFilter);
  };

  // ============================================
  // APLANAR ASIGNACIONES A FILAS DE ACTIVIDADES
  // ============================================
  const actividadesAplanadas = useMemo(() => {
    const filas = [];

    asignaciones.forEach((asignacion) => {
      const req = asignacion.requerimiento;
      const actividades = asignacion.actividadPlanRealConsultor || [];

      if (actividades.length === 0) {
        filas.push({
          requerimiento: req,
          actividad: null,
          consultorNombre: extraerNombreConsultor(req.titulo) || "-",
          fechaInicio: extraerFechaInicio(req.titulo) || "-",
          fechaFinal: extraerFechaFinal(req.titulo) || "-",
        });
      } else {
        actividades.forEach((act) => {
          filas.push({
            requerimiento: req,
            actividad: act,
            consultorNombre: act.usuario
              ? `${act.usuario.nombres || ""} ${act.usuario.apepaterno || ""} ${
                  act.usuario.apematerno || ""
                }`.trim()
              : extraerNombreConsultor(req.titulo) || "-",
            fechaInicio: act.fechainicio
              ? formatFecha(act.fechainicio)
              : extraerFechaInicio(req.titulo) || "-",
            fechaFinal: act.fechafin
              ? formatFecha(act.fechafin)
              : extraerFechaFinal(req.titulo) || "-",
          });
        });
      }
    });

    return filas;
  }, [asignaciones]);

  return (
    <>
      <section className="headbar headbar--abierto">
        <div className="headbar__title">
          <h3>Informe de actividades | SGR</h3>
          <p>Coordinación, control y optimización</p>
        </div>
      </section>

      <section className="bodyFeature">
        <div className="bodyFeature__controls">
          <div className="bodyFeature__controls__actions">
            <button
              className="btn btn__primary btn--ico"
              onClick={handleDownloadClick}
              disabled={loadingDownload}
            >
              {loadingDownload ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  <span> Descargando...</span>
                </>
              ) : (
                <>
                  <i className="bi bi-cloud-arrow-down-fill"></i>
                  Descargar
                </>
              )}
            </button>
          </div>
          <div className="bodyFeature__controls__filter">
            <button
              value="si"
              onClick={handlerOnClickFiltro}
              className="btn btn--simple"
            >
              <span>Filtro</span>
              <em className="icon-element-fitro"></em>
            </button>
          </div>
        </div>

        {/* ============================================ */}
        {/* SECCIÓN DE FILTROS */}
        {/* ============================================ */}
        {showFilter && (
          <div className="bodyFeature__searching form">
            <div className="bodyFeature__searching__input-container">
              {/* FECHA INICIO */}
              <div
                className="bodyFeature__searching__col"
                style={{ zIndex: 3 }}
              >
                <label>Fecha inicio</label>
                <DatePicker
                  selected={startDate}
                  isClearable
                  onChange={(date) => setStartDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Fecha inicio"
                  minDate={minDate}
                  maxDate={endDate || maxDate}
                  className="custom-datepicker"
                />
              </div>

              {/* FECHA FINAL */}
              <div
                className="bodyFeature__searching__col"
                style={{ zIndex: 3 }}
              >
                <label>Fecha final</label>
                <DatePicker
                  selected={endDate}
                  isClearable
                  onChange={(date) => setEndDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Fecha final"
                  minDate={startDate || minDate}
                  maxDate={maxDate}
                  className="custom-datepicker"
                />
              </div>
              {/* 🔥 NOMBRE COMERCIAL CON AUTOCOMPLETADO */}
              <div
                className="bodyFeature__searching__col"
                style={{ position: "relative" }}
              >
                <label>Nombre comercial</label>
                <div style={{ position: "relative", display: "flex" }}>
                  <input
                    type="text"
                    className="w-100"
                    value={orderNumberFilter}
                    onChange={(e) => {
                      setOrderNumberFilter(e.target.value);
                      setShowRazonSocialSuggestions(true);
                    }}
                    onFocus={() => setShowRazonSocialSuggestions(true)}
                    onBlur={() =>
                      setTimeout(
                        () => setShowRazonSocialSuggestions(false),
                        200,
                      )
                    }
                    placeholder={
                      loadingEmpresas
                        ? "Cargando empresas..."
                        : "Buscar nombre comercial..."
                    }
                    //disabled={loadingEmpresas}
                    style={{ paddingRight: "40px" }}
                  />
                  {/* ⬇️ BOTÓN DESPLEGABLE */}
                  <button
                    type="button"
                    onClick={handleDropdownClick}
                    //disabled={loadingEmpresas}
                    style={{
                      position: "absolute",
                      right: "5px",
                      top: "56%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      cursor: loadingEmpresas ? "not-allowed" : "pointer",
                      padding: "5px 10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: loadingEmpresas ? "#ccc" : "#666",
                    }}
                    onMouseEnter={(e) => {
                      if (!loadingEmpresas) e.target.style.color = "#333";
                    }}
                    onMouseLeave={(e) => {
                      if (!loadingEmpresas) e.target.style.color = "#666";
                    }}
                  >
                    <i
                      className={`bi ${
                        showRazonSocialSuggestions
                          ? "bi-chevron-up"
                          : "bi-chevron-down"
                      }`}
                      style={{ fontSize: "14px" }}
                    ></i>
                  </button>
                </div>

                {/* ⬇️ LISTA DESPLEGABLE */}
                {showRazonSocialSuggestions && !loadingEmpresas && (
                  <ul
                    style={{
                      position: "absolute",
                      top: "55%",
                      left: 0,
                      right: 0,
                      backgroundColor: "white",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      maxHeight: "200px",
                      overflowY: "auto",
                      zIndex: 2,
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    {/* Si hay filtro de búsqueda, mostrar resultados filtrados */}
                    {orderNumberFilter && filteredRazonesSociales.length > 0 ? (
                      filteredRazonesSociales.map((razon, index) => (
                        <li
                          key={index}
                          onClick={() => {
                            setOrderNumberFilter(razon);
                            setShowRazonSocialSuggestions(false);
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
                          {razon}
                        </li>
                      ))
                    ) : orderNumberFilter &&
                      filteredRazonesSociales.length === 0 ? (
                      <li
                        style={{
                          padding: "8px 12px",
                          color: "#999",
                          textAlign: "center",
                        }}
                      >
                        No se encontraron empresas
                      </li>
                    ) : (
                      /* Si no hay filtro, mostrar TODAS las opciones */
                      razonesSociales.map((razon, index) => (
                        <li
                          key={index}
                          onClick={() => {
                            setOrderNumberFilter(razon);
                            setShowRazonSocialSuggestions(false);
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
                          {razon}
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>

              {/* 🔥 CONSULTOR CON AUTOCOMPLETADO */}
              <div
                className="bodyFeature__searching__col"
                style={{ position: "relative" }}
              >
                <label>Consultor</label>
                <div style={{ position: "relative", display: "flex" }}>
                  <input
                    type="text"
                    className="w-100"
                    value={consultorFilter}
                    onChange={(e) => {
                      setConsultorFilter(e.target.value);
                      setShowConsultorSuggestions(true);
                    }}
                    onFocus={() => setShowConsultorSuggestions(true)}
                    onBlur={() =>
                      setTimeout(() => setShowConsultorSuggestions(false), 200)
                    }
                    placeholder={
                      loadingConsultores
                        ? "Cargando consultores..."
                        : "Buscar consultor..."
                    }
                    style={{ paddingRight: "40px" }}
                  />
                  {/* Botón desplegable */}
                  <button
                    type="button"
                    onClick={() =>
                      setShowConsultorSuggestions(!showConsultorSuggestions)
                    }
                    style={{
                      position: "absolute",
                      right: "5px",
                      top: "56%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      cursor: loadingConsultores ? "not-allowed" : "pointer",
                      padding: "5px 10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: loadingConsultores ? "#ccc" : "#666",
                    }}
                    onMouseEnter={(e) => {
                      if (!loadingConsultores) e.target.style.color = "#333";
                    }}
                    onMouseLeave={(e) => {
                      if (!loadingConsultores) e.target.style.color = "#666";
                    }}
                  >
                    <i
                      className={`bi ${
                        showConsultorSuggestions
                          ? "bi-chevron-up"
                          : "bi-chevron-down"
                      }`}
                      style={{ fontSize: "14px" }}
                    ></i>
                  </button>
                </div>

                {/* Lista desplegable */}
                {showConsultorSuggestions && !loadingConsultores && (
                  <div
                    style={{
                      position: "absolute",
                      top: "55%",
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
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {consultorFilter && filteredConsultores.length > 0 ? (
                      filteredConsultores.map((consultor) => (
                        <div
                          key={consultor.id}
                          onClick={() => {
                            setConsultorFilter(consultor.nombreCompleto);
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
                      ))
                    ) : consultorFilter && filteredConsultores.length === 0 ? (
                      <div
                        style={{
                          padding: "8px 12px",
                          color: "#999",
                          textAlign: "center",
                        }}
                      >
                        {isSearchingConsultores
                          ? "Buscando..."
                          : "No se encontraron consultores"}
                      </div>
                    ) : (
                      <>
                        {consultores.map((consultor) => (
                          <div
                            key={consultor.id}
                            onClick={() => {
                              setConsultorFilter(consultor.nombreCompleto);
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

                        {/* Botón "Cargar más" */}
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
                            onMouseEnter={(e) =>
                              (e.target.style.backgroundColor = "#e9ecef")
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.backgroundColor = "#f8f9fa")
                            }
                          >
                            {loadingConsultores
                              ? "Cargando..."
                              : "⬇️ Cargar más consultores"}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* BOTONES DE FILTRO */}
            <div className="bodyFeature__searching__buttons">
              <div className="bodyFeature__controls__button">
                <button
                  className="btn btn__primary btn--ico"
                  onClick={handleApplyFilterClick}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin />
                      <span> Buscando...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-search"></i>
                      Buscar
                    </>
                  )}
                </button>
              </div>
              <div className="bodyFeature__controls__button">
                <button
                  className="btn btn__primary btn--ico"
                  onClick={handleClearFiltersClick}
                  disabled={loadingLimpiarFiltros}
                >
                  {loadingLimpiarFiltros ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin />
                      <span> Limpiando...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-eraser"></i>
                      Limpiar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE VERIFICACIÓN */}
        <Verificacion
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          data={modalData}
        />

        {/* ============================================ */}
        {/* TABLA CON SCROLL Y PAGINACIÓN */}
        {/* ============================================ */}
        <div
          className="tabla-container"
          style={{
            height: "450px",
            overflowY: "auto",
            overflowX: "auto",
            position: "relative",
            border: "1px solid #dee2e6",
          }}
        >
          <table className="tabla_ list-pedido" cellSpacing="0" cellPadding="0">
            <thead
              style={{
                position: "sticky",
                top: 0,
                backgroundColor: "#fff",
                zIndex: 1,
              }}
            >
              <tr>
                <th className="thead">Posición</th>
                <th className="thead">Fecha de actividad</th>
                <th className="thead">Fecha inicio</th>
                <th className="thead">Fecha final</th>
                <th className="thead">Consultor</th>
                <th className="thead">Requerimiento</th>
                <th className="thead">Nombre comercial</th>
                <th className="thead theadPosition">Detalle de actividad</th>
                <th className="thead theadPosition">Hora</th>
              </tr>
            </thead>
            <tbody>
              {loadingAsignaciones && actividadesAplanadas.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    <FontAwesomeIcon icon={faSpinner} spin /> Cargando
                    actividades...
                  </td>
                </tr>
              ) : actividadesAplanadas.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    No hay actividades disponibles
                  </td>
                </tr>
              ) : (
                <>
                  {actividadesAplanadas.map((fila, index) => (
                    <tr
                      key={`${fila.requerimiento.idRequerimiento}-${fila.actividad?.id || 0}-${index}`}
                    >
                      <td>{index + 1}</td>
                      <td>
                        <strong>
                          {formatFecha(fila.requerimiento.fechaRegistro)}
                        </strong>
                      </td>
                      <td>{fila.fechaInicio}</td>
                      <td>{fila.fechaFinal}</td>
                      <td>{fila.consultorNombre}</td>
                      <td>{fila.requerimiento?.idRequerimiento || "-"}</td>
                      <td>
                        {fila.requerimiento?.empresa?.nombrecomercial ?? "-"}
                      </td>
                      {/* <td>
                        {fila.requerimiento.usuario
                          ? `${fila.requerimiento.usuario.nombres ?? ""} ${
                              fila.requerimiento.usuario.apepaterno ?? ""
                            } ${
                              fila.requerimiento.usuario.apematerno ?? ""
                            }`.trim()
                          : "-"}
                      </td> */}
                      <td className="tbodyPosition">
                        {fila.actividad
                          ? fila.actividad.descripcion || "-"
                          : "Sin actividad asignada"}
                      </td>
                      <td className="tbodyPosition">
                        {fila.actividad?.tiemporegular || "-"}
                      </td>
                    </tr>
                  ))}

                  {/* FILA DE PAGINACIÓN */}
                  <tr>
                    <td
                      colSpan="9"
                      style={{
                        padding: "15px",
                        textAlign: "center",
                        backgroundColor: "#f8f9fa",
                        borderTop: "2px solid #dee2e6",
                      }}
                    >
                      {/* Contador */}
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#666",
                          marginBottom: "10px",
                        }}
                      >
                        Mostrando <strong>{asignacionesCargadas}</strong> de{" "}
                        <strong>{totalAsignaciones}</strong> asignaciones
                        <br />
                        <small>
                          ({actividadesAplanadas.length} actividades en total)
                        </small>
                      </div>

                      {/* Enlaces de navegación */}
                      <div
                        style={{
                          display: "flex",
                          gap: "20px",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {/* Enlace Retroceder */}
                        {asignacionesPage > 0 && (
                          <div
                            onClick={retrocederAsignaciones}
                            style={{
                              cursor: "pointer",
                              color: "#007bff",
                              fontWeight: "bold",
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.color = "#0056b3")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.color = "#007bff")
                            }
                          >
                            <i className="bi bi-arrow-left-circle"></i>
                            Retroceder
                          </div>
                        )}

                        {/* Separador */}
                        {asignacionesPage > 0 && asignacionesHasMore && (
                          <span style={{ color: "#dee2e6" }}>|</span>
                        )}

                        {/* Enlace Cargar más */}
                        {asignacionesHasMore && (
                          <div
                            onClick={
                              loadingAsignaciones ? null : loadMoreAsignaciones
                            }
                            style={{
                              cursor: loadingAsignaciones
                                ? "not-allowed"
                                : "pointer",
                              color: loadingAsignaciones
                                ? "#6c757d"
                                : "#007bff",
                              fontWeight: "bold",
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                              opacity: loadingAsignaciones ? 0.6 : 1,
                            }}
                            onMouseEnter={(e) => {
                              if (!loadingAsignaciones)
                                e.currentTarget.style.color = "#0056b3";
                            }}
                            onMouseLeave={(e) => {
                              if (!loadingAsignaciones)
                                e.currentTarget.style.color = "#007bff";
                            }}
                          >
                            {loadingAsignaciones ? (
                              <>
                                <FontAwesomeIcon icon={faSpinner} spin />
                                Cargando...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-arrow-down-circle"></i>
                                Cargar más asignaciones
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Mensaje cuando se cargaron todos */}
                      {!asignacionesHasMore &&
                        asignacionesCargadas === totalAsignaciones && (
                          <div
                            style={{
                              color: "#28a745",
                              fontWeight: "bold",
                              marginTop: "10px",
                            }}
                          >
                            ✓ Todas las asignaciones han sido cargadas
                          </div>
                        )}
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
