import { fetchDataWithoutFilters } from "../../../../hooks/exportaciones/PedidosPage/ListarPedidosProcess";
import { MigrarSapProcess } from "../../../../hooks/exportaciones/PedidosPage/MigrarSapProcess";
import { PedidosState } from "../../../../hooks/exportaciones/PedidosPage/PedidosState";
import { MigrarSap } from "../../../../public/modal/exportaciones/MigrarSap";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Verificacion, Comprobacion } from "../../../../public/modal/Modals";
import { useAuth } from "../../../../contexts/Authutils";
import "react-datepicker/dist/react-datepicker.css";
import "../../../../styles/features/body.css";
import DatePicker from "react-datepicker";
import { useCallback, useEffect, useMemo, useState } from "react";
import { handleApplyFilterClickPedidos } from "../../../../hooks/exportaciones/PedidosPage/PedidosProcess";
import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { CrearFichaModal } from "../../../../public/modal/exportaciones/CrearFicha";
import { Link, Outlet } from "react-router-dom";
import { FindAllNameCompany } from "../../../../services/asignaciones/Empresa.js";
import { FindAllEstateRequerimient } from "../../../../services/asignaciones/EstadoRequerimiento.js";
import { FindAllConsultoresActivos } from "../../../../services/asignaciones/Consultores.js";
import { FindAllClientesActivos } from "../../../../services/asignaciones/Clientes.js";
//import { FindAllAsignacionesCoordinador } from "../../../../services/asignaciones/Requerimientos.js";
import { FindAllAsignacionesCoordinador } from "../../../../services/detalleasignaciones/listarasignaciones.js";
import {
  extraerNombreConsultor,
  extraerFechaInicio,
  extraerFechaFinal,
} from "../../../../helpers/extraerfechas/ParsearTitulo.js";
import { FindAllCodigosActivosCoordinador } from "../../../../services/asignaciones/Codigos.js";
import { FindAllCodigosIdActivosCoordinador } from "../../../../services/asignaciones/CodigosIdRequerimientos.js";

//Nuevos
import { handleApplyFilterClickRequerimientos } from "../../../../hooks/exportaciones/PedidosPage/Filtrarrequerimientosprocess.js";
import { handleClearFiltersRequerimientos } from "../../../../hooks/exportaciones/PedidosPage/Limpiarfiltrosprocess.js";
import { FiltrarRequerimientos } from "../../../../services/asignaciones/Filtrar.js";
import { SearchClientesByNombre } from "../../../../services/asignaciones/Clientes.js";
import { SearchConsultoresByNombre } from "../../../../services/asignaciones/Consultores.js";
import { modalMessages } from "../../../../config/modalMessages";

// 🔥 IMPORTAR SERVICIOS DE CREACIÓN
import {
  CreateRequerimiento,
  CreateActividadRequerimiento,
} from "../../../../services/asignaciones/CrearAsignaciones";

export function PedidosPage() {
  const {
    pedidos,
    setPedidos,
    modalData,
    setModalData,
    isMigrarModalOpen,
    setIsMigrarModalOpen,
    isModalMigrarSap,
    setIsModalMigrarSap,
    isModalOpen,
    setIsModalOpen,
    isLoading,
    setIsLoading,
    loading,
    setLoading,
    showFilter,
    setShowFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    orderCreationDataFilter,
    setOrderCreationDataFilter,
    orderNumberFilter,
    setOrderNumberFilter,
    customerNameFilter,
    setCustomerNameFilter,
    sellOrganizationFilter,
    setSellOrganizationFilter,
    customerNumberFilter,
    setCutsomerNumberFilter,
    has_fileFilter,
    sethas_fileFilter,
    hasAppliedFilter,
    setHasAppliedFilter,
    modelDataButton,
    setModalDataButton,
    filtradopedidos,
    setFiltrarPedidos,
    showModal,
    setShowModal,
  } = PedidosState();

  const { accessToken } = useAuth();

  // Estados para autocompletado
  const [consultorFilter, setConsultorFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [clienteFilter, setClienteFilter] = useState("");
  const [codigoFilter, setCodigoFilter] = useState("");
  const [idCodigoFilter, setIdCodigoFilter] = useState("");
  const [numeroTicketFilter, setNumeroTicketFilter] = useState("");
  const [showRazonSocialSuggestions, setShowRazonSocialSuggestions] =
    useState(false);
  const [showCodigoSuggestions, setShowCodigoSuggestions] = useState(false);
  const [showNumeroTicketSuggestions, setShowNumeroTicketSuggestions] =
    useState(false);

  const [razonesSociales, setRazonesSociales] = useState([]);
  const [loadingEmpresas, setLoadingEmpresas] = useState(false);

  // Estado para los estados de requerimiento
  const [estados, setEstados] = useState([]);
  const [loadingEstados, setLoadingEstados] = useState(false);

  const [showEstadoSuggestions, setShowEstadoSuggestions] = useState(false);

  // Estados para consultores
  const [consultores, setConsultores] = useState([]);
  const [loadingConsultores, setLoadingConsultores] = useState(false);
  const [consultoresPage, setConsultoresPage] = useState(0);
  const [consultoresHasMore, setConsultoresHasMore] = useState(true);
  const [showConsultorSuggestions, setShowConsultorSuggestions] =
    useState(false);

  // 🔥 NUEVOS estados para búsqueda de clientes// Para el debounce
  const [isSearchingConsutores, setIsSearchingConsultores] = useState(false);

  //Estados para los códigos de requerimientos
  const [codigosRequerimiento, setCodigoRequerimiento] = useState([]);
  const [loadingCodigoRequerimiento, setLoadingCodigoRequerimiento] =
    useState(false);
  const [codigoRequerimientoPage, setCodigoRequerimientoPage] = useState(0);
  const [codigoRequerimientoHasMore, setCodigoRequerimientoHasMore] =
    useState(true);
  const [
    showCodigoRequerimientoSuggestions,
    setShowCodigoRequerimientoSuggestions,
  ] = useState(false);

  //Estados para los id de los tickets

  const [idcodigosRequerimiento, setIdCodigoRequerimiento] = useState([]);
  const [loadingIdCodigoRequerimiento, setLoadingIdCodigoRequerimiento] =
    useState(false);
  const [idCodigoRequerimientoPage, setIdCodigoRequerimientoPage] = useState(0);
  const [idCodigoRequerimientoHasMore, setIdCodigoRequerimientoHasMore] =
    useState(true);
  const [
    showIdCodigoRequerimientoSuggestions,
    setShowIdCodigoRequerimientoSuggestions,
  ] = useState(false);

  // Estados para clientes
  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [clientesPage, setClientesPage] = useState(0);
  const [clientesHasMore, setClientesHasMore] = useState(true);
  const [showClienteSuggestions, setShowClienteSuggestions] = useState(false);

  // 🔥 NUEVOS estados para búsqueda de clientes
  const [clienteSearchTerm, setClienteSearchTerm] = useState(""); // Para el debounce
  const [isSearchingClientes, setIsSearchingClientes] = useState(false);

  // ============================================
  // NUEVOS ESTADOS PARA REQUERIMIENTOS PAGINADOS
  // ============================================
  const [requerimientos, setRequerimientos] = useState([]);
  const [loadingRequerimientos, setLoadingRequerimientos] = useState(false);
  const [requerimientosPage, setRequerimientosPage] = useState(0);
  const [requerimientosHasMore, setRequerimientosHasMore] = useState(true);
  const [totalRequerimientos, setTotalRequerimientos] = useState(0);
  const [requerimientosCargados, setRequerimientosCargados] = useState(0);

  //Limpiar
  const [loadingLimpiarFiltros, setLoadingLimpiarFiltros] = useState(false);

  //Estados adicionales
  const [empresasCompletas, setEmpresasCompletas] = useState([]); // Guardar empresas con ID
  const [estadosCompletos, setEstadosCompletos] = useState([]); // Guardar estados con ID

  // const codigosRequerimiento = [
  //   "MAS-2025-0067",
  //   "MAS-2025-0068",
  //   "MAS-2025-0069",
  //   "MAS-2025-0070",
  //   "TIC-2025-0045",
  //   "TIC-2025-0046",
  //   "ADM-2025-0123",
  //   "ADM-2025-0124",
  // ];

  const clientesAutocomplete = [
    "MITSUI & CO PERU S.A.",
    "COCA-COLA SERVICIOS DEL PERU S.A.",
    "ALICORP S.A.A.",
    "BACKUS Y JOHNSTON S.A.A.",
    "GLORIA S.A.",
    "NESTLÉ PERÚ S.A.",
    "AJEPER S.A.",
    "LINDLEY S.A.",
    "TELEFÓNICA DEL PERÚ S.A.A.",
    "BANCO DE CRÉDITO DEL PERÚ",
    "INTERBANK",
    "SCOTIABANK PERÚ S.A.A.",
  ];

  const numerosTicket = [
    "4599",
    "4600",
    "4601",
    "4602",
    "4603",
    "4604",
    "4605",
    "4606",
    "4607",
    "4608",
    "4609",
    "4610",
  ];

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
    razon.toLowerCase().includes(orderNumberFilter.toLowerCase())
  );

  //Nuevo Filtrar
  useEffect(() => {
    const loadEstadosRequerimiento = async () => {
      if (!accessToken) return;

      try {
        setLoadingEstados(true);
        const response = await FindAllEstateRequerimient(accessToken);

        // ✅ Guardar estados completos (con ID y descripción)
        setEstadosCompletos(response);

        // Guardar solo descripciones para el autocomplete
        const descripciones = response.map((estado) => estado.descripcion);
        setEstados(descripciones);

        console.log("Estados completos cargados:", response);
      } catch (error) {
        console.error("Error al cargar estados de requerimiento:", error);
        setEstados([]);
        setEstadosCompletos([]);
      } finally {
        setLoadingEstados(false);
      }
    };

    loadEstadosRequerimiento();
  }, [accessToken]);

  // Cargar consultores activos con paginación
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
        console.log("Consultores cargados:", consultoresData);
      } catch (error) {
        console.error("Error al cargar consultores:", error);
        setConsultores([]);
      } finally {
        setLoadingConsultores(false);
      }
    };

    loadConsultores();
  }, [accessToken]);

  //Código de requerimientos
  // Cargar consultores activos con paginación
  useEffect(() => {
    const loadCodigoRequerimiento = async () => {
      if (!accessToken) return;

      try {
        setLoadingCodigoRequerimiento(true);
        const response = await FindAllCodigosActivosCoordinador(
          accessToken,
          0,
          10
        );

        const codigosRequerimientoData = response.content.map((codigo) => ({
          idRequerimiento: codigo.idRequerimiento,
          codRequerimiento: codigo.codRequerimiento.trim(),
        }));

        setCodigoRequerimiento(codigosRequerimientoData);
        setCodigoRequerimientoPage(0);
        setCodigoRequerimientoHasMore(!response.last);
        console.log("Consultores cargados:", codigosRequerimientoData);
      } catch (error) {
        console.error("Error al cargar consultores:", error);
        setCodigoRequerimiento([]);
      } finally {
        setLoadingCodigoRequerimiento(false);
      }
    };

    loadCodigoRequerimiento();
  }, [accessToken]);

  //ID codigo requerimientoss
  useEffect(() => {
    const loadIdCodigoRequerimiento = async () => {
      if (!accessToken) return;

      try {
        setLoadingIdCodigoRequerimiento(true);
        const response = await FindAllCodigosIdActivosCoordinador(
          accessToken,
          0,
          10
        );

        const codigosRequerimientoData = response.content.map((codigo) => ({
          idRequerimiento: codigo.idRequerimiento,
        }));

        setIdCodigoRequerimiento(codigosRequerimientoData);
        setIdCodigoRequerimientoPage(0);
        setIdCodigoRequerimientoHasMore(!response.last);
        console.log("Id cargados:", codigosRequerimientoData);
      } catch (error) {
        console.error("Error al cargar Id de requerimientos:", error);
        setIdCodigoRequerimiento([]);
      } finally {
        setLoadingIdCodigoRequerimiento(false);
      }
    };

    loadIdCodigoRequerimiento();
  }, [accessToken]);

  // Cargar clientes activos con paginación
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
        console.log("Clientes cargados:", clientesData);
      } catch (error) {
        console.error("Error al cargar clientes:", error);
        setClientes([]);
      } finally {
        setLoadingClientes(false);
      }
    };

    loadClientes();
  }, [accessToken]);

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
          20 // Cargar más resultados en búsqueda
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

  //Consultores búsqueda con debounce
  useEffect(() => {
    const searchConsultores = async () => {
      if (!accessToken) return;

      // Si el input está vacío, cargar clientes activos normales
      if (!consultorFilter || consultorFilter.trim() === "") {
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
          console.error("Error al cargar clientes:", error);
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
          20 // Cargar más resultados en búsqueda
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

        console.log("Consultores no encontrados:", consultoresData);
      } catch (error) {
        console.error("Error al buscar consultores:", error);
        setClientes([]);
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
  // CARGAR REQUERIMIENTOS INICIAL
  // ============================================
  useEffect(() => {
    const loadRequerimientosInicial = async () => {
      if (!accessToken) return;

      try {
        setLoadingRequerimientos(true);
        const response = await FindAllAsignacionesCoordinador(
          accessToken,
          0,
          10
        );

        setRequerimientos(response.content);
        setRequerimientosPage(0);
        setRequerimientosHasMore(!response.last);
        setTotalRequerimientos(response.totalElements);
        setRequerimientosCargados(response.content.length);

        console.log("Requerimientos cargados:", response);
      } catch (error) {
        console.error("Error al cargar requerimientos:", error);
        setRequerimientos([]);
      } finally {
        setLoadingRequerimientos(false);
      }
    };

    loadRequerimientosInicial();
  }, [accessToken]);

  //Nuevo Filtrar
  const loadMoreRequerimientos = async () => {
    if (!requerimientosHasMore || loadingRequerimientos) return;

    try {
      setLoadingRequerimientos(true);
      const nextPage = requerimientosPage + 1;

      // ✅ Verificar si hay filtros activos
      const hayFiltrosActivos =
        orderNumberFilter ||
        codigoFilter ||
        startDate ||
        endDate ||
        clienteFilter ||
        idCodigoFilter ||
        consultorFilter ||
        estadoFilter;

      let response;

      if (hayFiltrosActivos) {
        // ✅ Si hay filtros, construir el objeto de filtros y usar FiltrarRequerimientos
        const filtros = {};

        // Convertir nombre comercial a ID
        if (orderNumberFilter) {
          const empresaEncontrada = empresasCompletas.find(
            (empresa) =>
              empresa.nombrecomercial.toLowerCase() ===
              orderNumberFilter.toLowerCase()
          );
          if (empresaEncontrada) {
            filtros.idEmpresa = empresaEncontrada.id;
          }
        }

        // Código de requerimiento
        if (codigoFilter && codigoFilter.trim() !== "") {
          filtros.codRequerimiento = codigoFilter.trim();
        }

        // Fechas
        if (startDate) {
          filtros.fechaInicio = format(startDate, "yyyy-MM-dd");
        }
        if (endDate) {
          filtros.fechaFin = format(endDate, "yyyy-MM-dd");
        }

        // Convertir cliente a ID
        if (clienteFilter) {
          const clienteEncontrado = clientes.find(
            (cliente) =>
              cliente.nombreCompleto.toLowerCase() ===
              clienteFilter.toLowerCase()
          );
          if (clienteEncontrado) {
            filtros.idUsuario = clienteEncontrado.id;
          }
        }

        // ID requerimiento
        if (idCodigoFilter && idCodigoFilter.trim() !== "") {
          const idRequerimiento = parseInt(idCodigoFilter.trim(), 10);
          if (!isNaN(idRequerimiento)) {
            filtros.idRequerimiento = idRequerimiento;
          }
        }

        // D) En construcción de filtros (loadMoreRequerimientos):
        if (consultorFilter && consultorFilter.trim() !== "") {
          filtros.nombreConsultor = consultorFilter.trim();
        }

        // Convertir estado a ID
        if (estadoFilter) {
          const estadoEncontrado = estadosCompletos.find(
            (estado) =>
              estado.descripcion.toLowerCase() === estadoFilter.toLowerCase()
          );
          if (estadoEncontrado) {
            filtros.idEstadoRequerimiento =
              estadoEncontrado.idEstadoRequerimiento;
          }
        }

        // Llamar al servicio de filtrado con la siguiente página
        response = await FiltrarRequerimientos(
          filtros,
          accessToken,
          nextPage,
          10
        );
      } else {
        // Si NO hay filtros, usar el endpoint normal
        response = await FindAllAsignacionesCoordinador(
          accessToken,
          nextPage,
          10
        );
      }

      const nuevosRequerimientos = response.content;

      setRequerimientos((prev) => [...prev, ...nuevosRequerimientos]);
      setRequerimientosPage(nextPage);
      setRequerimientosHasMore(!response.last);
      setRequerimientosCargados((prev) => prev + nuevosRequerimientos.length);

      console.log("Más requerimientos cargados:", nuevosRequerimientos);
    } catch (error) {
      console.error("Error al cargar más requerimientos:", error);
    } finally {
      setLoadingRequerimientos(false);
    }
  };

  // ============================================
  // RETROCEDER REQUERIMIENTOS (ELIMINAR ÚLTIMOS 10)
  // ============================================
  const retrocederRequerimientos = () => {
    if (requerimientosCargados <= 10) return; // No retroceder si solo hay 10 o menos

    // Eliminar los últimos 10 elementos
    setRequerimientos((prev) => prev.slice(0, -10));

    // Actualizar contadores
    setRequerimientosCargados((prev) => prev - 10);
    setRequerimientosPage((prev) => prev - 1);

    // Si estábamos en la última página, ahora hay más para cargar
    setRequerimientosHasMore(true);

    console.log("Retrocediendo: se eliminaron los últimos 10 requerimientos");
  };

  // Cargar más consultores (siguiente página)
  const loadMoreConsultores = async () => {
    if (!consultoresHasMore || loadingConsultores || isSearchingConsutores)
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

  // Cargar más clientes (siguiente página)
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
          20
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

  //cargar codigos requerimientos
  // Cargar más clientes (siguiente página)
  const loadMoreCodigoRequerimiento = async () => {
    if (!codigoRequerimientoHasMore || loadingCodigoRequerimiento) return;

    try {
      setLoadingCodigoRequerimiento(true);
      const nextPage = codigoRequerimientoPage + 1;
      const response = await FindAllCodigosActivosCoordinador(
        accessToken,
        nextPage,
        10
      );

      const nuevosCodigosRequerimientos = response.content.map((codigo) => ({
        idRequerimiento: codigo.idRequerimiento,
        codRequerimiento: codigo.codRequerimiento.trim(),
      }));

      setCodigoRequerimiento((prev) => [
        ...prev,
        ...nuevosCodigosRequerimientos,
      ]);
      setCodigoRequerimientoPage(nextPage);
      setCodigoRequerimientoHasMore(!response.last);
    } catch (error) {
      console.error("Error al cargar más clientes:", error);
    } finally {
      setLoadingCodigoRequerimiento(false);
    }
  };

  // Función para filtrar códigos de requerimiento

  const loadMoreIdCodigoRequerimiento = async () => {
    if (!idCodigoRequerimientoHasMore || loadingIdCodigoRequerimiento) return;

    try {
      setLoadingIdCodigoRequerimiento(true);
      const nextPage = idCodigoRequerimientoPage + 1;
      const response = await FindAllCodigosIdActivosCoordinador(
        accessToken,
        nextPage,
        10
      );

      const nuevosIdCodigosRequerimientos = response.content.map((codigo) => ({
        idRequerimiento: codigo.idRequerimiento,
      }));

      setIdCodigoRequerimiento((prev) => [
        ...prev,
        ...nuevosIdCodigosRequerimientos,
      ]);
      setIdCodigoRequerimientoPage(nextPage);
      setIdCodigoRequerimientoHasMore(!response.last);
    } catch (error) {
      console.error("Error al cargar más clientes:", error);
    } finally {
      setLoadingIdCodigoRequerimiento(false);
    }
  };

  const filteredIdCodigosRequerimiento = idcodigosRequerimiento.filter(
    (codigo) =>
      codigo.idRequerimiento
        .toString()
        .toLowerCase()
        .includes(idCodigoFilter.toString().toLowerCase()) // ← AGREGAR .toString()
  );

  const filteredCodigosRequerimiento = codigosRequerimiento.filter((codigo) =>
    codigo.codRequerimiento.toLowerCase().includes(codigoFilter.toLowerCase())
  );

  // Función para filtrar consultores
  const filteredConsultores = consultores.filter((consultor) =>
    consultor.nombreCompleto
      .toLowerCase()
      .includes(consultorFilter.toLowerCase())
  );

  // Función para filtrar clientes (del autocomplete)
  const filteredClientesDropdown = clientes.filter((cliente) =>
    cliente.nombreCompleto.toLowerCase().includes(clienteFilter.toLowerCase())
  );

  const filteredEstados = estados.filter((estado) =>
    estado.toLowerCase().includes(estadoFilter.toLowerCase())
  );

  const filteredNumerosTicket = numerosTicket.filter((numero) =>
    numero.includes(numeroTicketFilter)
  );

  const handleMigrarSap = async (request_numbers, society_Value) => {
    await MigrarSapProcess(
      accessToken,
      request_numbers,
      society_Value,
      setModalData,
      setIsMigrarModalOpen,
      setIsModalMigrarSap,
      fetchDataWithoutFilters,
      setPedidos
    );
  };

  //Configuracion de fechas

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
    [maxDate]
  );

  console.log("Resultado de pedidos: ", pedidos);

  const handlerOnClickFiltro = () => {
    setShowFilter(!showFilter);
  };

  console.log("Numero de pedido: ", orderNumberFilter);
  console.log("Nombre de cliente: ", customerNameFilter);

  //Nuevo Filtrar
  const handleApplyFilterClick = useCallback(async () => {
    await handleApplyFilterClickRequerimientos({
      accessToken,
      // Valores de los inputs
      orderNumberFilter,
      codigoFilter,
      startDate,
      endDate,
      clienteFilter,
      idCodigoFilter,
      consultorFilter,
      estadoFilter,
      // Listas completas para conversión
      razonesSociales: empresasCompletas,
      clientes: clientes,
      estados: estadosCompletos,
      // Funciones de actualización
      setRequerimientos,
      setRequerimientosPage,
      setRequerimientosHasMore,
      setTotalRequerimientos,
      setRequerimientosCargados,
      setLoading,
      setModalData,
      setShowModal,
    });
  }, [
    accessToken,
    orderNumberFilter,
    codigoFilter,
    startDate,
    endDate,
    clienteFilter,
    idCodigoFilter,
    consultorFilter,
    estadoFilter,
    empresasCompletas,
    clientes,
    estadosCompletos,
    setRequerimientos,
    setRequerimientosPage,
    setRequerimientosHasMore,
    setTotalRequerimientos,
    setRequerimientosCargados,
    setLoading,
    setModalData,
    setShowModal,
  ]);

  //Nuevo Filtrar Clear
  // ============================================
  // HANDLER PARA LIMPIAR FILTROS
  // ============================================
  const handleClearFiltersClick = useCallback(async () => {
    await handleClearFiltersRequerimientos({
      accessToken,
      setOrderNumberFilter,
      setCodigoFilter,
      setStartDate,
      setEndDate,
      setClienteFilter,
      setIdCodigoFilter,
      setConsultorFilter,
      setEstadoFilter,
      setRequerimientos,
      setRequerimientosPage,
      setRequerimientosHasMore,
      setTotalRequerimientos,
      setRequerimientosCargados,
      //setLoadingRequerimientos,
      setLoadingLimpiarFiltros,
    });
  }, [
    accessToken,
    setOrderNumberFilter, // ← AGREGADA
    setCodigoFilter, // ← AGREGADA
    setStartDate, // ← AGREGADA
    setEndDate, // ← AGREGADA
    setClienteFilter, // ← AGREGADA
    setIdCodigoFilter, // ← AGREGADA
    setConsultorFilter, // ← AGREGADA
    setEstadoFilter, // ← AGREGADA
    setRequerimientos, // 15 dependencias en total
    setRequerimientosPage,
    setRequerimientosHasMore,
    setTotalRequerimientos,
    setRequerimientosCargados,
    setLoadingLimpiarFiltros,
    //setLoadingRequerimientos,
  ]); // ✅ Todas las funciones incluidas

  // ⬇️ FUNCIÓN PARA MANEJAR EL CLICK EN EL BOTÓN DESPLEGABLE
  const handleDropdownClick = () => {
    setShowRazonSocialSuggestions(!showRazonSocialSuggestions);
  };

  // ============================================
  // FUNCIÓN PARA FORMATEAR FECHAS - CORREGIDA PARA UTC
  // ============================================
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

  const formatFechaInicioFinal = (timestamp) => {
    if (!timestamp) return "-";
    const date = new Date(timestamp);
    // 🔥 USAR UTC para evitar problemas de zona horaria
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  console.log(modalData);

  //Función cuando se terminar de grabar en el modal crear asignaciones y es existoso

  const recargarRequerimientos = async () => {
    try {
      setLoadingRequerimientos(true);
      const response = await FindAllAsignacionesCoordinador(accessToken, 0, 10);

      setRequerimientos(response.content);
      setRequerimientosPage(0);
      setRequerimientosHasMore(!response.last);
      setTotalRequerimientos(response.totalElements);
      setRequerimientosCargados(response.content.length);

      console.log("✅ Requerimientos recargados después de crear:", response);
    } catch (error) {
      console.error("❌ Error al recargar requerimientos:", error);
    } finally {
      setLoadingRequerimientos(false);
    }
  };

  // ============================================
  // 🔥 FUNCIÓN CREAR ASIGNACIÓN (MOVIDA DESDE EL MODAL)
  // ============================================
  const crearAsignacion = async (datosFormulario) => {
    try {
      console.log("📝 Iniciando creación de asignación...");
      console.log("📦 Datos recibidos:", datosFormulario);

      // 🔥 FUNCIÓN PARA FORMATEAR FECHAS - CORREGIDA PARA ZONA HORARIA LOCAL
      const formatDateToISO = (dateString) => {
        if (!dateString) return "";

        // ✅ SOLUCIÓN: Construir fecha en zona horaria local
        const [year, month, day] = dateString.split("-");
        const date = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day)
        );

        // Formatear manualmente a ISO sin conversión UTC
        const isoYear = date.getFullYear();
        const isoMonth = String(date.getMonth() + 1).padStart(2, "0");
        const isoDay = String(date.getDate()).padStart(2, "0");

        return `${isoYear}-${isoMonth}-${isoDay}T00:00:00`;
      };

      // Formatear fechas
      const fechaInicioISO = formatDateToISO(datosFormulario.fechaInicial);
      const fechaFinISO = formatDateToISO(datosFormulario.fechaFinal);

      console.log("📅 Fechas formateadas:");
      console.log("  Input fechaInicial:", datosFormulario.fechaInicial);
      console.log("  ISO fechaInicial:", fechaInicioISO);
      console.log("  Input fechaFinal:", datosFormulario.fechaFinal);
      console.log("  ISO fechaFinal:", fechaFinISO);

      // Crear título concatenado
      const formatDateForTitle = (dateString) => {
        if (!dateString) return "";
        const [year, month, day] = dateString.split("-");
        return `${day}/${month}/${year}`;
      };

      const fechaInicioFormatted = formatDateForTitle(
        datosFormulario.fechaInicial
      );
      const fechaFinFormatted = formatDateForTitle(datosFormulario.fechaFinal);
      const titulo = `${datosFormulario.consultorNombre} (${fechaInicioFormatted} - ${fechaFinFormatted})`;

      // Formatear descripción de estimación
      const descripcionEstimacion = `${parseFloat(datosFormulario.costo).toFixed(1)} ${datosFormulario.monedaNombre}.`;

      // 📝 PASO 1: Crear Requerimiento
      const requerimientoData = {
        titulo: titulo,
        idEmpresa: datosFormulario.empresaId,
        idSubfrente: datosFormulario.subfrenteId,
        idUsuario: datosFormulario.contactoId,
        detalle: datosFormulario.gerencia,
        descripcionEstimacion: descripcionEstimacion,
        detalleAsignacion: datosFormulario.detalle,
      };

      console.log("📤 Enviando requerimiento:", requerimientoData);
      const requerimientoCreado = await CreateRequerimiento(
        accessToken,
        requerimientoData
      );
      console.log("✅ Requerimiento creado:", requerimientoCreado);

      // 📝 PASO 2: Crear Actividad
      const actividadData = {
        idusuario: datosFormulario.consultorId,
        fechainicio: fechaInicioISO,
        fechafin: fechaFinISO,
        idtipoactividad: datosFormulario.actividadId,
        tiemporegular: parseFloat(datosFormulario.hora) || 0,
        costo: parseFloat(datosFormulario.costo) || 0,
      };

      console.log(
        "📤 Enviando actividad para requerimiento ID:",
        requerimientoCreado.idRequerimiento
      );
      console.log("📤 Datos de actividad:", actividadData);

      const actividadCreada = await CreateActividadRequerimiento(
        accessToken,
        requerimientoCreado.idRequerimiento,
        actividadData
      );
      console.log("✅ Actividad creada:", actividadCreada);

      // 🚪 Cerrar el modal
      console.log("🚪 Cerrando modal...");
      setIsMigrarModalOpen(false);

      // ✅ Mostrar modal de éxito DESPUÉS de cerrar
      setShowModal(true);
      setModalData(
        modalMessages.success({
          message: `Se ha creado el requerimiento ${requerimientoCreado.codRequerimiento || requerimientoCreado.idRequerimiento} correctamente.`,
        })
      );

      // 🔄 Recargar la tabla
      await recargarRequerimientos();

      return {
        requerimiento: requerimientoCreado,
        actividad: actividadCreada,
      };
    } catch (error) {
      console.error("❌ Error al crear asignación:", error);

      // Cerrar modal primero
      setIsMigrarModalOpen(false);

      // Mostrar error después
      setTimeout(() => {
        setModalData({
          title: "Error al crear asignación",
          message:
            error.message ||
            "Ocurrió un error al intentar crear la asignación. Por favor, intente nuevamente.",
        });
        setShowModal(true);
      }, 300);

      throw error;
    }
  };

  return (
    <>
      <section className="headbar headbar--abierto">
        <div className="headbar__title">
          <h3>Tickets | SGR</h3>
          <p>Coordinación, control y optimización</p>
        </div>

        <div className="headbar__acciones">
          <button
            className="btn btn--ico btn--medium btn__secondary--outline"
            onClick={() => setIsMigrarModalOpen(true)}
          >
            <i className="bi bi-arrow-repeat"></i>
            Asignar Tickets
          </button>
        </div>
      </section>

      <section className="bodyFeature">
        <div className="bodyFeature__controls derecha">
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

        {showFilter && (
          <div className="bodyFeature__searching form">
            <div className="bodyFeature__searching__input-container">
              {/* ⬇️ INPUT DESPLEGABLE CON AUTOCOMPLETADO */}
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
                        200
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
                      top: "100%",
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

              {/* Código requerimiento con autocompletado */}
              <div
                className="bodyFeature__searching__col"
                style={{ position: "relative" }}
              >
                <label>Código Requerimiento</label>

                <div style={{ position: "relative", display: "flex" }}>
                  <input
                    type="text"
                    className="w-100"
                    value={codigoFilter}
                    onChange={(e) => {
                      setCodigoFilter(e.target.value);
                      setShowCodigoRequerimientoSuggestions(true);
                    }}
                    onFocus={() => setShowCodigoRequerimientoSuggestions(true)}
                    onBlur={() =>
                      setTimeout(
                        () => setShowCodigoRequerimientoSuggestions(false),
                        200
                      )
                    }
                    placeholder={
                      loadingCodigoRequerimiento
                        ? "Cargando códigos..."
                        : "Buscar código..."
                    }
                    //disabled={loadingCodigoRequerimiento}
                    style={{ paddingRight: "40px" }}
                  />

                  {/* Botón desplegable */}
                  <button
                    type="button"
                    onClick={() =>
                      setShowCodigoRequerimientoSuggestions(
                        !showCodigoRequerimientoSuggestions
                      )
                    }
                    //disabled={loadingCodigoRequerimiento}
                    style={{
                      position: "absolute",
                      right: "5px",
                      top: "56%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      cursor: loadingCodigoRequerimiento
                        ? "not-allowed"
                        : "pointer",
                      padding: "5px 10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: loadingCodigoRequerimiento ? "#ccc" : "#666",
                    }}
                    onMouseEnter={(e) => {
                      if (!loadingCodigoRequerimiento)
                        e.target.style.color = "#333";
                    }}
                    onMouseLeave={(e) => {
                      if (!loadingCodigoRequerimiento)
                        e.target.style.color = "#666";
                    }}
                  >
                    <i
                      className={`bi ${
                        showCodigoRequerimientoSuggestions
                          ? "bi-chevron-up"
                          : "bi-chevron-down"
                      }`}
                      style={{ fontSize: "14px" }}
                    ></i>
                  </button>
                </div>

                {/* LISTA DESPLEGABLE */}
                {showCodigoRequerimientoSuggestions && (
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
                    onMouseDown={(e) => e.preventDefault()} // evita cierre
                  >
                    {/* Caso con filtro */}
                    {codigoFilter && filteredCodigosRequerimiento.length > 0 ? (
                      filteredCodigosRequerimiento.map((item) => (
                        <div
                          key={item.idRequerimiento}
                          onClick={() => {
                            setCodigoFilter(item.codRequerimiento);
                            setShowCodigoRequerimientoSuggestions(false);
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
                          {item.codRequerimiento}
                        </div>
                      ))
                    ) : codigoFilter &&
                      filteredCodigosRequerimiento.length === 0 ? (
                      <div
                        style={{
                          padding: "8px 12px",
                          color: "#999",
                          textAlign: "center",
                        }}
                      >
                        No se encontraron códigos
                      </div>
                    ) : (
                      <>
                        {/* Mostrar todos si no hay filtro */}
                        {codigosRequerimiento.map((item) => (
                          <div
                            key={item.idRequerimiento}
                            onClick={() => {
                              setCodigoFilter(item.codRequerimiento);
                              setShowCodigoRequerimientoSuggestions(false);
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
                            {item.codRequerimiento}
                          </div>
                        ))}

                        {/* PAGINACIÓN */}
                        {codigoRequerimientoHasMore && (
                          <div
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={loadMoreCodigoRequerimiento}
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
                            {loadingCodigoRequerimiento
                              ? "Cargando..."
                              : "⬇️ Cargar más códigos"}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

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

              <div
                className="bodyFeature__searching__col"
                style={{ position: "relative" }}
              >
                <label>Cliente</label>
                <div style={{ position: "relative", display: "flex" }}>
                  <input
                    type="text"
                    className="w-100"
                    value={clienteFilter}
                    onChange={(e) => {
                      setClienteFilter(e.target.value);
                      setShowClienteSuggestions(true);
                    }}
                    onFocus={() => setShowClienteSuggestions(true)}
                    onBlur={() =>
                      setTimeout(() => setShowClienteSuggestions(false), 200)
                    }
                    placeholder={
                      loadingClientes
                        ? "Cargando clientes..."
                        : "Buscar cliente..."
                    }
                    //disabled={loadingClientes}
                    style={{ paddingRight: "40px" }}
                  />
                  {/* Botón desplegable */}
                  <button
                    type="button"
                    onClick={() =>
                      setShowClienteSuggestions(!showClienteSuggestions)
                    }
                    //disabled={loadingClientes}
                    style={{
                      position: "absolute",
                      right: "5px",
                      top: "56%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      cursor: loadingClientes ? "not-allowed" : "pointer",
                      padding: "5px 10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: loadingClientes ? "#ccc" : "#666",
                    }}
                    onMouseEnter={(e) => {
                      if (!loadingClientes) e.target.style.color = "#333";
                    }}
                    onMouseLeave={(e) => {
                      if (!loadingClientes) e.target.style.color = "#666";
                    }}
                  >
                    <i
                      className={`bi ${
                        showClienteSuggestions
                          ? "bi-chevron-up"
                          : "bi-chevron-down"
                      }`}
                      style={{ fontSize: "14px" }}
                    ></i>
                  </button>
                </div>

                {/* Lista desplegable con scroll y paginación */}
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
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {/* Si hay filtro de búsqueda, mostrar resultados filtrados */}
                    {clienteFilter && filteredClientesDropdown.length > 0 ? (
                      filteredClientesDropdown.map((cliente) => (
                        <div
                          key={cliente.id}
                          onClick={() => {
                            setClienteFilter(cliente.nombreCompleto);
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
                    ) : clienteFilter &&
                      filteredClientesDropdown.length === 0 ? (
                      <div
                        style={{
                          padding: "8px 12px",
                          color: "#999",
                          textAlign: "center",
                        }}
                      >
                        No se encontraron clientes
                      </div>
                    ) : (
                      /* Si no hay filtro, mostrar TODAS las opciones */
                      <>
                        {clientes.map((cliente) => (
                          <div
                            key={cliente.id}
                            onClick={() => {
                              setClienteFilter(cliente.nombreCompleto);
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

                        {/* Botón "Cargar más" si hay más páginas */}
                        {clientesHasMore && (
                          <div
                            onMouseDown={(e) => e.preventDefault()} // <-- EVITA CIERRE
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
                            onMouseEnter={(e) =>
                              (e.target.style.backgroundColor = "#e9ecef")
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.backgroundColor = "#f8f9fa")
                            }
                          >
                            {loadingClientes
                              ? "Cargando..."
                              : "⬇️ Cargar más clientes"}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Número de Tickets con autocompletado */}
              {/* ID Requerimiento con autocompletado */}
              <div
                className="bodyFeature__searching__col"
                style={{ position: "relative" }}
              >
                <label>Número de tickets</label>

                <div style={{ position: "relative", display: "flex" }}>
                  <input
                    type="text"
                    className="w-100"
                    value={idCodigoFilter}
                    onChange={(e) => {
                      setIdCodigoFilter(e.target.value);
                      setShowIdCodigoRequerimientoSuggestions(true);
                    }}
                    onFocus={() =>
                      setShowIdCodigoRequerimientoSuggestions(true)
                    }
                    onBlur={() =>
                      setTimeout(
                        () => setShowIdCodigoRequerimientoSuggestions(false),
                        200
                      )
                    }
                    placeholder={
                      loadingIdCodigoRequerimiento
                        ? "Cargando IDs..."
                        : "Buscar numero de Tickets..."
                    }
                    //disabled={loadingIdCodigoRequerimiento}
                    style={{ paddingRight: "40px" }}
                  />

                  {/* Botón desplegable */}
                  <button
                    type="button"
                    onClick={() =>
                      setShowIdCodigoRequerimientoSuggestions(
                        !showIdCodigoRequerimientoSuggestions
                      )
                    }
                    //disabled={loadingIdCodigoRequerimiento}
                    style={{
                      position: "absolute",
                      right: "5px",
                      top: "56%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      cursor: loadingIdCodigoRequerimiento
                        ? "not-allowed"
                        : "pointer",
                      padding: "5px 10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: loadingIdCodigoRequerimiento ? "#ccc" : "#666",
                    }}
                    onMouseEnter={(e) => {
                      if (!loadingIdCodigoRequerimiento)
                        e.target.style.color = "#333";
                    }}
                    onMouseLeave={(e) => {
                      if (!loadingIdCodigoRequerimiento)
                        e.target.style.color = "#666";
                    }}
                  >
                    <i
                      className={`bi ${
                        showIdCodigoRequerimientoSuggestions
                          ? "bi-chevron-up"
                          : "bi-chevron-down"
                      }`}
                      style={{ fontSize: "14px" }}
                    ></i>
                  </button>
                </div>

                {/* Lista desplegable */}
                {showIdCodigoRequerimientoSuggestions && (
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
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {/* Si hay filtro de búsqueda */}
                    {idCodigoFilter &&
                    filteredIdCodigosRequerimiento.length > 0 ? (
                      filteredIdCodigosRequerimiento.map((codigo, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setIdCodigoFilter(codigo.idRequerimiento);
                            setShowIdCodigoRequerimientoSuggestions(false);
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
                          {codigo.idRequerimiento}
                        </div>
                      ))
                    ) : idCodigoFilter &&
                      filteredIdCodigosRequerimiento.length === 0 ? (
                      <div
                        style={{
                          padding: "8px 12px",
                          color: "#999",
                          textAlign: "center",
                        }}
                      >
                        No se encontraron IDs
                      </div>
                    ) : (
                      <>
                        {/* Mostrar todos los IDs */}
                        {idcodigosRequerimiento.map((codigo, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              setIdCodigoFilter(codigo.idRequerimiento);
                              setShowIdCodigoRequerimientoSuggestions(false);
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
                            {codigo.idRequerimiento}
                          </div>
                        ))}

                        {/* Botón cargar más */}
                        {idCodigoRequerimientoHasMore && (
                          <div
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={loadMoreIdCodigoRequerimiento}
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
                            {loadingIdCodigoRequerimiento
                              ? "Cargando..."
                              : "⬇️ Cargar más IDs"}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

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
                    //disabled={loadingConsultores}
                    style={{ paddingRight: "40px" }}
                  />
                  {/* Botón desplegable */}
                  <button
                    type="button"
                    onClick={() =>
                      setShowConsultorSuggestions(!showConsultorSuggestions)
                    }
                    //disabled={loadingConsultores}
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

                {/* Lista desplegable con scroll y paginación */}
                {showConsultorSuggestions && !loadingConsultores && (
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
                    {/* Si hay filtro de búsqueda, mostrar resultados filtrados */}
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
                        No se encontraron consultores
                      </div>
                    ) : (
                      /* Si no hay filtro, mostrar TODAS las opciones */
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

                        {/* Botón "Cargar más" si hay más páginas */}
                        {consultoresHasMore && (
                          <div
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

              {/* Estado con scroll desplegable (como empresa) */}
              <div
                className="bodyFeature__searching__col"
                style={{ position: "relative" }}
              >
                <label>Estado</label>
                <div style={{ position: "relative", display: "flex" }}>
                  <input
                    type="text"
                    className="w-100"
                    value={estadoFilter}
                    onChange={(e) => {
                      setEstadoFilter(e.target.value);
                      setShowEstadoSuggestions(true);
                    }}
                    onFocus={() => setShowEstadoSuggestions(true)}
                    onBlur={() =>
                      setTimeout(() => setShowEstadoSuggestions(false), 200)
                    }
                    placeholder={
                      loadingEstados
                        ? "Cargando estados..."
                        : "Buscar estado..."
                    }
                    //disabled={loadingEstados}
                    style={{ paddingRight: "40px" }}
                  />
                  {/* Botón desplegable */}
                  <button
                    type="button"
                    onClick={() =>
                      setShowEstadoSuggestions(!showEstadoSuggestions)
                    }
                    //disabled={loadingEstados}
                    style={{
                      position: "absolute",
                      right: "5px",
                      top: "56%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      cursor: loadingEstados ? "not-allowed" : "pointer",
                      padding: "5px 10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: loadingEstados ? "#ccc" : "#666",
                    }}
                    onMouseEnter={(e) => {
                      if (!loadingEstados) e.target.style.color = "#333";
                    }}
                    onMouseLeave={(e) => {
                      if (!loadingEstados) e.target.style.color = "#666";
                    }}
                  >
                    <i
                      className={`bi ${
                        showEstadoSuggestions
                          ? "bi-chevron-up"
                          : "bi-chevron-down"
                      }`}
                      style={{ fontSize: "14px" }}
                    ></i>
                  </button>
                </div>

                {/* Lista desplegable con scroll */}
                {showEstadoSuggestions && !loadingEstados && (
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
                    {/* Si hay filtro de búsqueda, mostrar resultados filtrados */}
                    {estadoFilter && filteredEstados.length > 0 ? (
                      filteredEstados.map((estado, index) => (
                        <li
                          key={index}
                          onClick={() => {
                            setEstadoFilter(estado);
                            setShowEstadoSuggestions(false);
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
                          {estado}
                        </li>
                      ))
                    ) : estadoFilter && filteredEstados.length === 0 ? (
                      <li
                        style={{
                          padding: "8px 12px",
                          color: "#999",
                          textAlign: "center",
                        }}
                      >
                        No se encontraron estados
                      </li>
                    ) : (
                      /* Si no hay filtro, mostrar TODAS las opciones */
                      estados.map((estado, index) => (
                        <li
                          key={index}
                          onClick={() => {
                            setEstadoFilter(estado);
                            setShowEstadoSuggestions(false);
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
                          {estado}
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>
            </div>

            <div className="bodyFeature__searching__buttons">
              <div className="bodyFeature__controls__button">
                <button
                  className="btn btn__primary btn--ico"
                  onClick={handleApplyFilterClick}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span>
                        <FontAwesomeIcon icon={faSpinner} spin /> Buscando...
                      </span>
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
                      Limpiando...
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

        {isMigrarModalOpen && (
          <CrearFichaModal
            isOpen={isMigrarModalOpen}
            onClose={() => setIsMigrarModalOpen(false)}
            onSubmit={crearAsignacion}
          />
        )}

        <Verificacion
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          data={modalData}
        />

        <Comprobacion
          isOpen={isModalMigrarSap}
          onClose={() => setIsModalMigrarSap(false)}
          data={modalData}
        />

        {/* ============================================ */}
        {/* TABLA CON SCROLL Y PAGINACIÓN */}
        {/* ============================================ */}
        <div
          className="tabla-container"
          style={{
            height: "450px", // Altura FIJA (no maxHeight)
            overflowY: "auto", // Scroll vertical
            overflowX: "auto", // Scroll horizontal si es necesario
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
                <th className="thead">Fecha de creación</th>
                <th className="thead">Nombre comercial</th>
                <th className="thead">Código requerimiento</th>
                <th className="thead">ID</th>
                <th className="thead">Consultor</th>
                <th className="thead">Cliente</th>
                <th className="thead">Estado requerimiento</th>
                <th className="thead">Fecha inicio</th>
                <th className="thead">Fecha final</th>
                <th className="thead">Moneda</th>
                <th className="thead">Monto</th>
                <th className="thead">-</th>
              </tr>
            </thead>
            <tbody>
              {loadingRequerimientos && requerimientos.length === 0 ? (
                <tr>
                  <td
                    colSpan="13"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    <FontAwesomeIcon icon={faSpinner} spin /> Cargando
                    requerimientos...
                  </td>
                </tr>
              ) : requerimientos.length === 0 ? (
                <tr>
                  <td
                    colSpan="13"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    No hay requerimientos disponibles
                  </td>
                </tr>
              ) : (
                <>
                  {requerimientos.map((item, index) => {
                    const req = item.requerimiento; // Requerimiento principal
                    const act = item.actividadPlanRealConsultor?.[0]; // Primera actividad del arreglo

                    return (
                      <tr key={req.idRequerimiento}>
                        <td>{index + 1}</td>

                        <td>
                          <strong>{formatFecha(req.fechaRegistro)}</strong>
                        </td>

                        <td>{req?.empresa?.nombrecomercial ?? "-"}</td>

                        <td>{req.codRequerimiento || "-"}</td>

                        <td>{req.idRequerimiento}</td>

                        <td>{extraerNombreConsultor(req.titulo) || "-"}</td>

                        {/* <td>
                          {act.usuario
                            ? `${req.usuario.nombres ?? ""} ${req.usuario.apepaterno ?? ""} ${req.usuario.apematerno ?? ""}`.trim()
                            : "-"}
                        </td> */}

                        <td>
                          {req.usuario
                            ? `${req.usuario.nombres ?? ""} ${req.usuario.apepaterno ?? ""} ${req.usuario.apematerno ?? ""}`.trim()
                            : "-"}
                        </td>

                        <td>{req?.estadoRequerimiento?.descripcion ?? "-"}</td>

                        <td>
                          {formatFechaInicioFinal(act?.fechainicio) || "-"}
                        </td>

                        <td>{formatFechaInicioFinal(act?.fechafin) || "-"}</td>

                        <td>
                          {req?.empresa?.moneda?.descripcion ?? "desconocido"}
                        </td>

                        <td>{req.descripcionEstimacion || "0.00"}</td>

                        <td className="ficha__group">
                          <Link
                            to={`/features/seguimiento/sgr/general/?ticket_id=${req.idRequerimiento}`}
                          >
                            detalle
                          </Link>
                        </td>
                      </tr>
                    );
                  })}

                  {/* ============================================ */}
                  {/* FILA ESPECIAL PARA CONTROLES DE PAGINACIÓN */}
                  {/* ============================================ */}
                  <tr>
                    <td
                      colSpan="13"
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
                        Mostrando <strong>{requerimientosCargados}</strong> de{" "}
                        <strong>{totalRequerimientos}</strong> requerimientos
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
                        {requerimientosCargados > 10 && (
                          <div
                            onClick={retrocederRequerimientos}
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
                        {requerimientosCargados > 10 &&
                          requerimientosHasMore && (
                            <span style={{ color: "#dee2e6" }}>|</span>
                          )}

                        {/* Enlace Cargar más */}
                        {requerimientosHasMore && (
                          <div
                            onClick={
                              loadingRequerimientos
                                ? null
                                : loadMoreRequerimientos
                            }
                            style={{
                              cursor: loadingRequerimientos
                                ? "not-allowed"
                                : "pointer",
                              color: loadingRequerimientos
                                ? "#6c757d"
                                : "#007bff",
                              fontWeight: "bold",
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                              opacity: loadingRequerimientos ? 0.6 : 1,
                            }}
                            onMouseEnter={(e) => {
                              if (!loadingRequerimientos)
                                e.currentTarget.style.color = "#0056b3";
                            }}
                            onMouseLeave={(e) => {
                              if (!loadingRequerimientos)
                                e.currentTarget.style.color = "#007bff";
                            }}
                          >
                            {loadingRequerimientos ? (
                              <>
                                <FontAwesomeIcon icon={faSpinner} spin />
                                Cargando...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-arrow-down-circle"></i>
                                Cargar más requerimientos
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Mensaje cuando se cargaron todos */}
                      {!requerimientosHasMore &&
                        requerimientosCargados === totalRequerimientos && (
                          <div
                            style={{
                              color: "#28a745",
                              fontWeight: "bold",
                              marginTop: "10px",
                            }}
                          >
                            ✓ Todos los requerimientos han sido cargados
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
      {/* 👇 IMPORTANTE: Agrega el Outlet al final */}
      <Outlet />
    </>
  );
}
