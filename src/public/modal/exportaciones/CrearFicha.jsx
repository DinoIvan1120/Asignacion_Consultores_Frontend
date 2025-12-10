import PropTypes from "prop-types";
import { faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import "../../../styles/exportaciones/PedidosPage/CrearFicha.css";
import {
  FindAllConsultoresActivos,
  SearchConsultoresByNombre,
} from "../../../services/asignaciones/Consultores";
import { useAuth } from "../../../contexts/Authutils";
import {
  FindAllNameCompany,
  FindClientesByEmpresa,
} from "../../../services/asignaciones/Empresa";
import { FindAllNameMonedas } from "../../../services/asignaciones/Monedas";
import { FindAllNameSubFrentes } from "../../../services/asignaciones/SubFrente";
import { FindAllNameTipoActividad } from "../../../services/asignaciones/TipoActividades";

//Importacion nuevo
import { FindMonedaByEmpresa } from "../../../services/asignaciones/Empresa";

export function CrearFichaModal({
  isOpen,
  onClose,
  onSubmit, // 🔥 Función que viene del padre (PedidosPage)
}) {
  // Estados para los campos del formulario
  const [consultorValue, setConsultorValue] = useState("");
  const [actividadValue, setActividadValue] = useState("");
  const [costoValue, setCostoValue] = useState("");
  const [empresaValue, setEmpresaValue] = useState("");
  const [fechaInicialValue, setFechaInicialValue] = useState("");
  const [fechaFinalValue, setFechaFinalValue] = useState("");
  const [monedaValue, setMonedaValue] = useState("");
  const [contactoValue, setContactoValue] = useState("");
  const [detalleValue, setDetalleValue] = useState("");
  const [subfrenteValue, setSubfrenteValue] = useState("");
  const [horaValue, setHoraValue] = useState("");
  const [gerenciaValue, setGerenciaValue] = useState("");

  // 🔥 ESTADOS PARA IDs Y NOMBRES SELECCIONADOS
  const [consultorSeleccionadoId, setConsultorSeleccionadoId] = useState(null);
  const [consultorSeleccionadoNombre, setConsultorSeleccionadoNombre] =
    useState("");
  const [actividadSeleccionadaId, setActividadSeleccionadaId] = useState(null);
  const [monedaSeleccionadaId, setMonedaSeleccionadaId] = useState(null);
  const [monedaSeleccionadaNombre, setMonedaSeleccionadaNombre] = useState("");
  const [subfrenteSeleccionadoId, setSubfrenteSeleccionadoId] = useState(null);
  const [contactoSeleccionadoId, setContactoSeleccionadoId] = useState(null);

  // 🔥 ESTADO DE LOADING PARA EL BOTÓN
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Consultores
  const [consultoresFicha, setConsultoresFicha] = useState([]);
  const [loadingConsultores, setLoadingConsultores] = useState(false);
  const [consultoresPage, setConsultoresPage] = useState(0);
  const [consultoresHasMore, setConsultoresHasMore] = useState(true);
  const [showConsultorFichaSuggestions, setShowConsultorFichaSuggestions] =
    useState(false);
  const [consultorFilterFicha, setConsultorFilterFicha] = useState("");
  const [isSearchingConsutores, setIsSearchingConsultores] = useState(false);

  // Empresas
  const [razonesSociales, setRazonesSociales] = useState([]);
  const [loadingEmpresas, setLoadingEmpresas] = useState(false);
  const [empresasCompletas, setEmpresasCompletas] = useState([]);

  // Clientes/Contactos
  const [clientesPorEmpresa, setClientesPorEmpresa] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [empresaSeleccionadaId, setEmpresaSeleccionadaId] = useState(null);

  // Tipo de Actividad
  const [tiposActividad, setTiposActividad] = useState([]);
  const [loadingActividades, setLoadingActividades] = useState(false);
  const [showActividadSuggestions, setShowActividadSuggestions] =
    useState(false);
  const [actividadFilter, setActividadFilter] = useState("");

  // Monedas
  const [monedas, setMonedas] = useState([]);
  const [loadingMonedas, setLoadingMonedas] = useState(false);
  const [showMonedaSuggestions, setShowMonedaSuggestions] = useState(false);
  const [monedaFilter, setMonedaFilter] = useState("");

  //MonedasEmprda
  const [monedaId, setMonedaId] = useState(null);
  const [monedaDescripcion, setMonedaDescripcion] = useState("");

  // Subfrentes
  const [subfrentes, setSubfrentes] = useState([]);
  const [loadingSubfrentes, setLoadingSubfrentes] = useState(false);
  const [showSubfrenteSuggestions, setShowSubfrenteSuggestions] =
    useState(false);
  const [subfrenteFilter, setSubfrenteFilter] = useState("");

  // Token
  const { accessToken } = useAuth();

  // Estados para mostrar/ocultar sugerencias
  const [showEmpresaSuggestions, setShowEmpresaSuggestions] = useState(false);
  const [showContactoSuggestions, setShowContactoSuggestions] = useState(false);

  // 🔥 ESTADO PARA MENSAJES DE ERROR LOCALES
  const [errorMessage, setErrorMessage] = useState("");

  // Cargar empresas
  useEffect(() => {
    const loadNombresComerciales = async () => {
      if (!accessToken) return;

      try {
        setLoadingEmpresas(true);
        const response = await FindAllNameCompany(accessToken);
        setEmpresasCompletas(response);
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

  // Cargar consultores activos
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

        setConsultoresFicha(consultoresData);
        setConsultoresPage(0);
        setConsultoresHasMore(!response.last);
        console.log("Consultores cargados:", consultoresData);
      } catch (error) {
        console.error("Error al cargar consultores:", error);
        setConsultoresFicha([]);
      } finally {
        setLoadingConsultores(false);
      }
    };

    loadConsultores();
  }, [accessToken]);

  // Búsqueda de consultores con debounce
  useEffect(() => {
    const searchConsultores = async () => {
      if (!accessToken) return;

      if (!consultorFilterFicha || consultorFilterFicha.trim() === "") {
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

          setConsultoresFicha(consultoresData);
          setConsultoresPage(0);
          setConsultoresHasMore(!response.last);
        } catch (error) {
          console.error("Error al cargar consultores:", error);
          setConsultoresFicha([]);
        } finally {
          setIsSearchingConsultores(false);
        }
        return;
      }

      try {
        setIsSearchingConsultores(true);
        const response = await SearchConsultoresByNombre(
          accessToken,
          consultorFilterFicha.trim(),
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

        setConsultoresFicha(consultoresData);
        setConsultoresPage(0);
        setConsultoresHasMore(!response.last);
      } catch (error) {
        console.error("Error al buscar consultores:", error);
        setConsultoresFicha([]);
      } finally {
        setIsSearchingConsultores(false);
      }
    };

    const timeoutId = setTimeout(() => {
      searchConsultores();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [consultorFilterFicha, accessToken]);

  // Cargar tipos de actividad
  useEffect(() => {
    const loadTiposActividad = async () => {
      if (!accessToken) return;

      try {
        setLoadingActividades(true);
        const response = await FindAllNameTipoActividad(accessToken);
        setTiposActividad(response);
        console.log("Tipos de actividad cargados:", response);
      } catch (error) {
        console.error("Error al cargar tipos de actividad:", error);
        setTiposActividad([]);
      } finally {
        setLoadingActividades(false);
      }
    };

    loadTiposActividad();
  }, [accessToken]);

  // Cargar monedas
  // useEffect(() => {
  //   const loadMonedas = async () => {
  //     if (!accessToken) return;

  //     try {
  //       setLoadingMonedas(true);
  //       const response = await FindAllNameMonedas(accessToken);
  //       setMonedas(response);
  //       console.log("Monedas cargadas:", response);
  //     } catch (error) {
  //       console.error("Error al cargar monedas:", error);
  //       setMonedas([]);
  //     } finally {
  //       setLoadingMonedas(false);
  //     }
  //   };

  //   loadMonedas();
  // }, [accessToken]);

  //Moneda por empresa

  useEffect(() => {
    const loadMonedaByEmpresa = async () => {
      if (!accessToken || !empresaSeleccionadaId) return;
      try {
        setLoadingMonedas(true);
        const response = await FindMonedaByEmpresa(
          accessToken,
          empresaSeleccionadaId
        );
        setMonedaId(response.idmoneda);
        setMonedaDescripcion(response.descripcion); // Asumimos que response es un objeto moneda
        console.log("Moneda por empresa cargada:", response);
      } catch (error) {
        console.error("Error al cargar moneda por empresa:", error);
        setMonedas([]);
      } finally {
        setLoadingMonedas(false);
      }
    };
    loadMonedaByEmpresa();
  }, [accessToken, empresaSeleccionadaId]);

  // Cargar subfrentes
  useEffect(() => {
    const loadSubfrentes = async () => {
      if (!accessToken) return;

      try {
        setLoadingSubfrentes(true);
        const response = await FindAllNameSubFrentes(accessToken);
        setSubfrentes(response);
        console.log("Subfrentes cargados:", response);
      } catch (error) {
        console.error("Error al cargar subfrentes:", error);
        setSubfrentes([]);
      } finally {
        setLoadingSubfrentes(false);
      }
    };

    loadSubfrentes();
  }, [accessToken]);

  // Cargar más consultores
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

      setConsultoresFicha((prev) => [...prev, ...nuevosConsultores]);
      setConsultoresPage(nextPage);
      setConsultoresHasMore(!response.last);
    } catch (error) {
      console.error("Error al cargar más consultores:", error);
    } finally {
      setLoadingConsultores(false);
    }
  };

  // Filtrar consultores
  const filteredConsultores = consultoresFicha.filter((consultor) =>
    consultor.nombreCompleto
      .toLowerCase()
      .includes(consultorFilterFicha.toLowerCase())
  );

  // Cargar clientes por empresa
  useEffect(() => {
    const loadClientesPorEmpresa = async () => {
      if (!accessToken || !empresaSeleccionadaId) {
        setClientesPorEmpresa([]);
        return;
      }

      try {
        setLoadingClientes(true);
        console.log(
          "Cargando clientes para empresa ID:",
          empresaSeleccionadaId
        );

        const response = await FindClientesByEmpresa(
          accessToken,
          empresaSeleccionadaId
        );

        const clientesFormateados = response.map((cliente) => ({
          id: cliente.idUsuario,
          nombreCompleto: cliente.nombreCompleto || "-",
        }));

        setClientesPorEmpresa(clientesFormateados);
        console.log("Clientes cargados:", clientesFormateados);
      } catch (error) {
        console.error("Error al cargar clientes por empresa:", error);
        setClientesPorEmpresa([]);
      } finally {
        setLoadingClientes(false);
      }
    };

    loadClientesPorEmpresa();
  }, [accessToken, empresaSeleccionadaId]);

  // 🔥 MANEJAR SELECCIÓN DE EMPRESA
  const handleEmpresaSelect = (nombreEmpresa) => {
    setEmpresaValue(nombreEmpresa);
    setShowEmpresaSuggestions(false);

    const empresaEncontrada = empresasCompletas.find(
      (emp) => emp.nombrecomercial === nombreEmpresa
    );

    if (empresaEncontrada) {
      setEmpresaSeleccionadaId(empresaEncontrada.id);
      console.log("Empresa seleccionada:", empresaEncontrada);
      setContactoValue("");
      setContactoSeleccionadoId(null);
    }
  };

  // Filtrar razones sociales
  const filteredRazonesSociales = razonesSociales.filter((razon) =>
    razon.toLowerCase().includes(empresaValue.toLowerCase())
  );

  // Filtrar clientes
  const filteredClientesEmpresa = clientesPorEmpresa.filter((cliente) =>
    cliente.nombreCompleto.toLowerCase().includes(contactoValue.toLowerCase())
  );

  // Filtrar actividades
  const filteredActividades = tiposActividad.filter((actividad) =>
    actividad.descripcion.toLowerCase().includes(actividadFilter.toLowerCase())
  );

  // Filtrar monedas
  const filteredMonedas = monedas.filter((moneda) =>
    moneda.descripcion.toLowerCase().includes(monedaFilter.toLowerCase())
  );

  // Filtrar subfrentes
  const filteredSubfrentes = subfrentes.filter((subfrente) =>
    subfrente.descripcion.toLowerCase().includes(subfrenteFilter.toLowerCase())
  );

  // 🔥 FUNCIÓN DE SUBMIT SIMPLIFICADA - SOLO VALIDA Y LLAMA A onSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Limpiar errores previos

    // ✅ VALIDACIONES BÁSICAS
    if (!consultorSeleccionadoId) {
      setErrorMessage("Por favor seleccione un consultor");
      return;
    }

    if (!actividadSeleccionadaId) {
      setErrorMessage("Por favor seleccione una actividad");
      return;
    }

    if (!empresaSeleccionadaId) {
      setErrorMessage("Por favor seleccione una empresa");
      return;
    }

    if (!contactoSeleccionadoId) {
      setErrorMessage("Por favor seleccione un contacto");
      return;
    }

    if (!subfrenteSeleccionadoId) {
      setErrorMessage("Por favor seleccione un subfrente");
      return;
    }

    if (!monedaId) {
      setErrorMessage("La empresa seleccionada no tiene una moneda asignada");
      return;
    }
    // if (!monedaSeleccionadaId) {
    //   setErrorMessage("Por favor seleccione una moneda");
    //   return;
    // }

    if (!fechaInicialValue || !fechaFinalValue) {
      setErrorMessage("Por favor ingrese las fechas de inicio y fin");
      return;
    }

    if (!horaValue || parseFloat(horaValue) <= 0) {
      setErrorMessage("Por favor ingrese las horas (debe ser mayor a 0)");
      return;
    }

    if (!costoValue || parseFloat(costoValue) <= 0) {
      setErrorMessage("Por favor ingrese el costo (debe ser mayor a 0)");
      return;
    }

    // 📦 CONSTRUIR OBJETO DE DATOS PARA ENVIAR AL PADRE
    const datosFormulario = {
      // IDs necesarios para los servicios
      consultorId: consultorSeleccionadoId,
      actividadId: actividadSeleccionadaId,
      empresaId: empresaSeleccionadaId,
      contactoId: contactoSeleccionadoId,
      subfrenteId: subfrenteSeleccionadoId,
      //monedaId: monedaSeleccionadaId,
      monedaId: monedaId,

      // Nombres necesarios para crear el título
      consultorNombre: consultorSeleccionadoNombre,
      //monedaNombre: monedaSeleccionadaNombre,
      monedaNombre: monedaDescripcion,

      // Fechas (string en formato yyyy-mm-dd)
      fechaInicial: fechaInicialValue,
      fechaFinal: fechaFinalValue,

      // Valores numéricos
      hora: horaValue,
      costo: costoValue,

      // Textos
      detalle: detalleValue,
      gerencia: gerenciaValue,
    };

    console.log("📤 Modal enviando datos al padre:", datosFormulario);

    // ✅ LLAMAR A LA FUNCIÓN DEL PADRE (que maneja TODO: servicios, modales, recarga)
    setIsSubmitting(true);
    try {
      await onSubmit(datosFormulario);
      // El padre se encarga de cerrar el modal, mostrar mensajes, etc.
      limpiarFormulario();
    } catch (error) {
      // El padre maneja los errores
      console.error("Error en onSubmit:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔥 FUNCIÓN PARA LIMPIAR FORMULARIO
  const limpiarFormulario = () => {
    setConsultorFilterFicha("");
    setActividadFilter("");
    setCostoValue("");
    setEmpresaValue("");
    setFechaInicialValue("");
    setFechaFinalValue("");
    setMonedaFilter("");
    setContactoValue("");
    setDetalleValue("");
    setSubfrenteFilter("");
    setHoraValue("");
    setGerenciaValue("");

    // Limpiar IDs
    setConsultorSeleccionadoId(null);
    setConsultorSeleccionadoNombre("");
    setActividadSeleccionadaId(null);
    setMonedaId(null);
    setMonedaDescripcion("");
    //setMonedaSeleccionadaId(null);
    //setMonedaSeleccionadaNombre("");
    setSubfrenteSeleccionadoId(null);
    setContactoSeleccionadoId(null);
    setEmpresaSeleccionadaId(null);

    setErrorMessage("");
  };

  const handleCancel = () => {
    limpiarFormulario();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="customModal">
      <div className="customModal__content">
        <div className="direccion">
          <button
            className="signup-x"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <h2>Registro de Asignaciones</h2>

        {/* 🔥 MOSTRAR MENSAJE DE ERROR SI EXISTE */}
        {errorMessage && (
          <div
            style={{
              backgroundColor: "#f8d7da",
              color: "#721c24",
              padding: "12px",
              borderRadius: "4px",
              marginBottom: "15px",
              border: "1px solid #f5c6cb",
            }}
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            {/* Consultor con autocompletado */}
            <div className="form-grouppp" style={{ position: "relative" }}>
              <label htmlFor="consultor">Consultor *</label>
              <div style={{ position: "relative", display: "flex" }}>
                <input
                  className="h"
                  type="text"
                  id="consultor"
                  name="consultor"
                  value={consultorFilterFicha}
                  onChange={(e) => {
                    setConsultorFilterFicha(e.target.value);
                    setShowConsultorFichaSuggestions(true);
                    setConsultorSeleccionadoId(null);
                    setConsultorSeleccionadoNombre("");
                  }}
                  onFocus={() => setShowConsultorFichaSuggestions(true)}
                  onBlur={() =>
                    setTimeout(
                      () => setShowConsultorFichaSuggestions(false),
                      200
                    )
                  }
                  placeholder={
                    loadingConsultores
                      ? "Cargando consultores..."
                      : "Buscar consultor..."
                  }
                  //disabled={loadingConsultores || isSubmitting}
                  style={{ paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConsultorFichaSuggestions(
                      !showConsultorFichaSuggestions
                    )
                  }
                  //disabled={loadingConsultores || isSubmitting}
                  style={{
                    position: "absolute",
                    right: "5px",
                    top: "28%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    cursor:
                      loadingConsultores || isSubmitting
                        ? "not-allowed"
                        : "pointer",
                    padding: "5px 10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: loadingConsultores || isSubmitting ? "#ccc" : "#666",
                  }}
                >
                  <i
                    className={`bi ${
                      showConsultorFichaSuggestions
                        ? "bi-chevron-up"
                        : "bi-chevron-down"
                    }`}
                    style={{ fontSize: "14px" }}
                  ></i>
                </button>
              </div>

              {showConsultorFichaSuggestions && !loadingConsultores && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + -20px)",
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
                  {consultorFilterFicha && filteredConsultores.length > 0 ? (
                    filteredConsultores.map((consultor) => (
                      <div
                        key={consultor.id}
                        onClick={() => {
                          setConsultorFilterFicha(consultor.nombreCompleto);
                          setConsultorSeleccionadoId(consultor.id);
                          setConsultorSeleccionadoNombre(
                            consultor.nombreCompleto
                          );
                          setShowConsultorFichaSuggestions(false);
                          console.log("Consultor seleccionado:", consultor);
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
                  ) : consultorFilterFicha &&
                    filteredConsultores.length === 0 ? (
                    <div
                      style={{
                        padding: "8px 12px",
                        //color: "#999",
                        textAlign: "center",
                      }}
                    >
                      No se encontraron consultores
                    </div>
                  ) : (
                    <>
                      {consultoresFicha.map((consultor) => (
                        <div
                          key={consultor.id}
                          onClick={() => {
                            setConsultorFilterFicha(consultor.nombreCompleto);
                            setConsultorSeleccionadoId(consultor.id);
                            setConsultorSeleccionadoNombre(
                              consultor.nombreCompleto
                            );
                            setShowConsultorFichaSuggestions(false);
                            console.log("Consultor seleccionado:", consultor);
                          }}
                          style={{
                            padding: "8px 12px",
                            cursor: "pointer",
                            borderBottom: "1px solid #eee",
                            textAlign: "start",
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
                          onClick={loadMoreConsultores}
                          style={{
                            padding: "10px 12px",
                            cursor: "pointer",
                            backgroundColor: "#f8f9fa",
                            textAlign: "start",
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

            {/* RESTO DE LOS CAMPOS SE MANTIENEN IGUAL... */}
            {/* Por brevedad, continúo con los campos principales */}

            {/* Actividad */}
            <div className="form-grouppp" style={{ position: "relative" }}>
              <label htmlFor="actividad">Actividad *</label>
              <div style={{ position: "relative", display: "flex" }}>
                <input
                  className="h"
                  type="text"
                  id="actividad"
                  value={actividadFilter}
                  onChange={(e) => {
                    setActividadFilter(e.target.value);
                    setShowActividadSuggestions(true);
                    setActividadSeleccionadaId(null);
                  }}
                  onFocus={() => setShowActividadSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowActividadSuggestions(false), 200)
                  }
                  placeholder={
                    loadingActividades
                      ? "Cargando actividades..."
                      : "Buscar actividad..."
                  }
                  //disabled={loadingActividades || isSubmitting}
                  style={{ paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowActividadSuggestions(!showActividadSuggestions)
                  }
                  //disabled={loadingActividades || isSubmitting}
                  style={{
                    position: "absolute",
                    right: "5px",
                    top: "28%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    cursor:
                      loadingActividades || isSubmitting
                        ? "not-allowed"
                        : "pointer",
                    padding: "5px 10px",
                  }}
                >
                  <i
                    className={`bi ${
                      showActividadSuggestions
                        ? "bi-chevron-up"
                        : "bi-chevron-down"
                    }`}
                    style={{ fontSize: "14px" }}
                  ></i>
                </button>
              </div>

              {showActividadSuggestions && !loadingActividades && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + -20px)",
                    left: 0,
                    right: 0,
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    maxHeight: "250px",
                    overflowY: "auto",
                    zIndex: 1000,
                    padding: 0,
                    margin: 0,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  {actividadFilter && filteredActividades.length > 0 ? (
                    filteredActividades.map((actividad) => (
                      <div
                        key={actividad.id}
                        onClick={() => {
                          setActividadFilter(actividad.descripcion);
                          setActividadSeleccionadaId(actividad.id);
                          setShowActividadSuggestions(false);
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
                        {actividad.descripcion}
                      </div>
                    ))
                  ) : actividadFilter && filteredActividades.length === 0 ? (
                    <div
                      style={{
                        padding: "8px 12px",
                        color: "#999",
                        textAlign: "center",
                      }}
                    >
                      No se encontraron actividades
                    </div>
                  ) : (
                    tiposActividad.map((actividad) => (
                      <div
                        key={actividad.id}
                        onClick={() => {
                          setActividadFilter(actividad.descripcion);
                          setActividadSeleccionadaId(actividad.id);
                          setShowActividadSuggestions(false);
                        }}
                        style={{
                          padding: "8px 12px",
                          cursor: "pointer",
                          borderBottom: "1px solid #eee",
                          textAlign: "start",
                        }}
                        onMouseEnter={(e) =>
                          (e.target.style.backgroundColor = "#f0f0f0")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.backgroundColor = "white")
                        }
                      >
                        {actividad.descripcion}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Costo */}
            <div className="form-grouppp">
              <label htmlFor="costo">Costo *</label>
              <input
                className="h"
                type="number"
                step="0.01"
                id="costo"
                value={costoValue}
                onChange={(e) => setCostoValue(e.target.value)}
                placeholder="Ingrese un costo"
              />
            </div>
          </div>

          {/* Segunda fila: Empresa, Fecha inicial, Fecha final */}
          <div className="form-row">
            {/* Empresa */}
            <div className="form-grouppp" style={{ position: "relative" }}>
              <label htmlFor="empresa">Empresa *</label>
              <div style={{ position: "relative", display: "flex" }}>
                <input
                  className="h"
                  type="text"
                  id="empresa"
                  value={empresaValue}
                  onChange={(e) => {
                    setEmpresaValue(e.target.value);
                    setShowEmpresaSuggestions(true);
                    if (e.target.value === "") {
                      setEmpresaSeleccionadaId(null);
                      setContactoValue("");
                      setContactoSeleccionadoId(null);
                    }
                  }}
                  onFocus={() => setShowEmpresaSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowEmpresaSuggestions(false), 200)
                  }
                  placeholder={
                    loadingEmpresas
                      ? "Cargando empresas..."
                      : "Buscar empresa..."
                  }
                  //disabled={loadingEmpresas || isSubmitting}
                  style={{ paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowEmpresaSuggestions(!showEmpresaSuggestions)
                  }
                  //disabled={loadingEmpresas || isSubmitting}
                  style={{
                    position: "absolute",
                    right: "5px",
                    top: "28%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    cursor:
                      loadingEmpresas || isSubmitting
                        ? "not-allowed"
                        : "pointer",
                    padding: "5px 10px",
                  }}
                >
                  <i
                    className={`bi ${
                      showEmpresaSuggestions
                        ? "bi-chevron-up"
                        : "bi-chevron-down"
                    }`}
                    style={{ fontSize: "14px" }}
                  ></i>
                </button>
              </div>

              {showEmpresaSuggestions && !loadingEmpresas && (
                <ul
                  style={{
                    position: "absolute",
                    top: "calc(100% + -20px)",
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
                  {empresaValue && filteredRazonesSociales.length > 0 ? (
                    filteredRazonesSociales.map((razon, index) => (
                      <li
                        key={index}
                        onClick={() => handleEmpresaSelect(razon)}
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
                  ) : empresaValue && filteredRazonesSociales.length === 0 ? (
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
                    razonesSociales.map((razon, index) => (
                      <li
                        key={index}
                        onClick={() => handleEmpresaSelect(razon)}
                        style={{
                          padding: "8px 12px",
                          cursor: "pointer",
                          borderBottom: "1px solid #eee",
                          textAlign: "start",
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

            {/* Fecha inicial */}
            <div className="form-grouppp">
              <label htmlFor="fecha_inicial">Fecha inicial *</label>
              <input
                className="h"
                type="date"
                id="fecha_inicial"
                value={fechaInicialValue}
                onChange={(e) => setFechaInicialValue(e.target.value)}
              />
            </div>

            {/* Fecha final */}
            <div className="form-grouppp">
              <label htmlFor="fecha_final">Fecha final *</label>
              <input
                className="h"
                type="date"
                id="fecha_final"
                value={fechaFinalValue}
                onChange={(e) => setFechaFinalValue(e.target.value)}
              />
            </div>
          </div>

          {/* Tercera fila: Moneda, Contacto, Detalle */}
          <div className="form-row">
            {/* Moneda */}
            <div className="form-grouppp" style={{ position: "relative" }}>
              <label htmlFor="moneda">Moneda *</label>

              <input
                type="text"
                id="moneda"
                className="h"
                placeholder={
                  !empresaSeleccionadaId
                    ? "seleccione una empresa..."
                    : loadingMonedas
                      ? "Cargando clientes..."
                      : "Buscar contacto..."
                }
                value={monedaDescripcion}
                // value={
                //   loadingMonedas
                //     ? "Cargando moneda..."
                //     : monedaDescripcion || ""
                // }
                style={{
                  cursor: "not-allowed",
                }}
              />
            </div>

            {/* Contacto */}
            <div className="form-grouppp" style={{ position: "relative" }}>
              <label htmlFor="contacto">Contacto *</label>
              <div style={{ position: "relative", display: "flex" }}>
                <input
                  className="h"
                  type="text"
                  id="contacto"
                  value={contactoValue}
                  onChange={(e) => {
                    setContactoValue(e.target.value);
                    setShowContactoSuggestions(true);
                    setContactoSeleccionadoId(null);
                  }}
                  onFocus={() => setShowContactoSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowContactoSuggestions(false), 200)
                  }
                  placeholder={
                    !empresaSeleccionadaId
                      ? "seleccione una empresa..."
                      : loadingClientes
                        ? "Cargando clientes..."
                        : "Buscar contacto..."
                  }
                  //disabled={
                  // !empresaSeleccionadaId || loadingClientes || isSubmitting
                  //}
                  style={{ paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowContactoSuggestions(!showContactoSuggestions)
                  }
                  //</div>disabled={
                  //!empresaSeleccionadaId || loadingClientes || isSubmitting
                  //}
                  style={{
                    position: "absolute",
                    right: "5px",
                    top: "28%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    cursor:
                      !empresaSeleccionadaId || loadingClientes || isSubmitting
                        ? "not-allowed"
                        : "pointer",
                    padding: "5px 10px",
                  }}
                >
                  <i
                    className={`bi ${
                      showContactoSuggestions
                        ? "bi-chevron-up"
                        : "bi-chevron-down"
                    }`}
                    style={{ fontSize: "14px" }}
                  ></i>
                </button>
              </div>

              {showContactoSuggestions &&
                !loadingClientes &&
                empresaSeleccionadaId && (
                  <ul
                    style={{
                      position: "absolute",
                      top: "calc(100% + -20px)",
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
                    {contactoValue && filteredClientesEmpresa.length > 0 ? (
                      filteredClientesEmpresa.map((cliente) => (
                        <li
                          key={cliente.id}
                          onClick={() => {
                            setContactoValue(cliente.nombreCompleto);
                            setContactoSeleccionadoId(cliente.id);
                            setShowContactoSuggestions(false);
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
                        </li>
                      ))
                    ) : contactoValue &&
                      filteredClientesEmpresa.length === 0 ? (
                      <li
                        style={{
                          padding: "8px 12px",
                          color: "#999",
                          textAlign: "center",
                        }}
                      >
                        No se encontraron clientes
                      </li>
                    ) : clientesPorEmpresa.length > 0 ? (
                      clientesPorEmpresa.map((cliente) => (
                        <li
                          key={cliente.id}
                          onClick={() => {
                            setContactoValue(cliente.nombreCompleto);
                            setContactoSeleccionadoId(cliente.id);
                            setShowContactoSuggestions(false);
                          }}
                          style={{
                            padding: "8px 12px",
                            cursor: "pointer",
                            borderBottom: "1px solid #eee",
                            textAlign: "start",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.backgroundColor = "#f0f0f0")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.backgroundColor = "white")
                          }
                        >
                          {cliente.nombreCompleto}
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
                        No hay clientes para esta empresa
                      </li>
                    )}
                  </ul>
                )}
            </div>

            {/* Detalle */}
            <div className="form-grouppp">
              <label htmlFor="detalle">Detalle *</label>
              <input
                className="h"
                type="text"
                id="detalle"
                value={detalleValue}
                onChange={(e) => setDetalleValue(e.target.value)}
                placeholder="Ingrese un detalle"
              />
            </div>
          </div>

          {/* Cuarta fila: Subfrente, Hora, Gerencia */}
          <div className="form-rows">
            {/* Subfrente */}
            <div className="form-grouppp" style={{ position: "relative" }}>
              <label htmlFor="subfrente">Subfrente *</label>
              <div style={{ position: "relative", display: "flex" }}>
                <input
                  className="h"
                  type="text"
                  id="subfrente"
                  value={subfrenteFilter}
                  onChange={(e) => {
                    setSubfrenteFilter(e.target.value);
                    setShowSubfrenteSuggestions(true);
                    setSubfrenteSeleccionadoId(null);
                  }}
                  onFocus={() => setShowSubfrenteSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSubfrenteSuggestions(false), 200)
                  }
                  placeholder={
                    loadingSubfrentes
                      ? "Cargando subfrentes..."
                      : "Buscar subfrente..."
                  }
                  //disabled={loadingSubfrentes || isSubmitting}
                  style={{ paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowSubfrenteSuggestions(!showSubfrenteSuggestions)
                  }
                  //disabled={loadingSubfrentes || isSubmitting}
                  style={{
                    position: "absolute",
                    right: "5px",
                    top: "28%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    cursor:
                      loadingSubfrentes || isSubmitting
                        ? "not-allowed"
                        : "pointer",
                    padding: "5px 10px",
                  }}
                >
                  <i
                    className={`bi ${
                      showSubfrenteSuggestions
                        ? "bi-chevron-up"
                        : "bi-chevron-down"
                    }`}
                    style={{ fontSize: "14px" }}
                  ></i>
                </button>
              </div>

              {showSubfrenteSuggestions && !loadingSubfrentes && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + -20px)",
                    left: 0,
                    right: 0,
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    maxHeight: "250px",
                    overflowY: "auto",
                    zIndex: 1000,
                    padding: 0,
                    margin: 0,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  {subfrenteFilter && filteredSubfrentes.length > 0 ? (
                    filteredSubfrentes.map((subfrente) => (
                      <div
                        key={subfrente.idSubfrente}
                        onClick={() => {
                          setSubfrenteFilter(subfrente.descripcion);
                          setSubfrenteSeleccionadoId(subfrente.idSubfrente);
                          setShowSubfrenteSuggestions(false);
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
                        {subfrente.descripcion}
                      </div>
                    ))
                  ) : subfrenteFilter && filteredSubfrentes.length === 0 ? (
                    <div
                      style={{
                        padding: "8px 12px",
                        color: "#999",
                        textAlign: "center",
                      }}
                    >
                      No se encontraron subfrentes
                    </div>
                  ) : (
                    subfrentes.map((subfrente) => (
                      <div
                        key={subfrente.idSubfrente}
                        onClick={() => {
                          setSubfrenteFilter(subfrente.descripcion);
                          setSubfrenteSeleccionadoId(subfrente.idSubfrente);
                          setShowSubfrenteSuggestions(false);
                        }}
                        style={{
                          padding: "8px 12px",
                          cursor: "pointer",
                          borderBottom: "1px solid #eee",
                          textAlign: "start",
                        }}
                        onMouseEnter={(e) =>
                          (e.target.style.backgroundColor = "#f0f0f0")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.backgroundColor = "white")
                        }
                      >
                        {subfrente.descripcion}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Hora */}
            <div className="form-grouppp">
              <label htmlFor="hora">Hora *</label>
              <input
                className="h"
                type="number"
                step="0.1"
                id="hora"
                value={horaValue}
                onChange={(e) => setHoraValue(e.target.value)}
                placeholder="Ingrese las horas"
              />
            </div>

            {/* Gerencia */}
            <div className="form-grouppp">
              <label htmlFor="gerencia">Gerencia comercial *</label>
              <input
                className="h"
                type="text"
                id="gerencia"
                value={gerenciaValue}
                onChange={(e) => setGerenciaValue(e.target.value)}
                placeholder="Ingrese una gerencia"
              />
            </div>
          </div>

          <div className="customModal__buttons">
            <button
              className="btn btn__primary btn--ico m-2"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin /> Guardando...
                </>
              ) : (
                "Guardar"
              )}
            </button>
            <button
              className="btn btn__primary btn--ico m-2 btn__red"
              type="button"
              onClick={handleCancel}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

CrearFichaModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired, // 🔥 FUNCIÓN OBLIGATORIA DEL PADRE
};
