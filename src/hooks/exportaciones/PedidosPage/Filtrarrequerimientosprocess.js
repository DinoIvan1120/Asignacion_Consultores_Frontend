import { format } from "date-fns";
import { FindAllRequerimientosCoordinador } from "../../../services/asignaciones/Requerimientos";
import { modalMessages } from "../../../config/modalMessages";
import { FiltrarRequerimientos } from "../../../services/asignaciones/Filtrar";

/**
 * 🔍 Proceso de aplicar filtros de requerimientos
 *
 * Convierte los valores de los inputs (nombres, descripciones) a IDs
 * y llama al servicio de filtrado
 */
export const handleApplyFilterClickRequerimientos = async ({
  accessToken,
  // Valores de los inputs (strings)
  orderNumberFilter, // Nombre comercial (string)
  codigoFilter, // Código requerimiento (string)
  startDate, // Date object
  endDate, // Date object
  clienteFilter, // Nombre completo del cliente (string)
  idCodigoFilter, // Número de ticket (string)
  consultorFilter,
  estadoFilter, // Descripción del estado (string)
  // Listas para convertir nombres a IDs
  razonesSociales, // Array de empresas con { id, nombrecomercial }
  clientes, // Array de clientes con { id, nombreCompleto }
  estados, // Array de estados con { idEstadoRequerimiento, descripcion }
  // Funciones de actualización
  setRequerimientos,
  setRequerimientosPage,
  setRequerimientosHasMore,
  setTotalRequerimientos,
  setRequerimientosCargados,
  setLoading,
  setModalData,
  setShowModal,
}) => {
  try {
    setLoading(true);

    // ============================================
    // VALIDAR QUE AL MENOS UN FILTRO ESTÉ PRESENTE
    // ============================================
    const hayFiltros =
      orderNumberFilter ||
      codigoFilter ||
      startDate ||
      endDate ||
      clienteFilter ||
      idCodigoFilter ||
      consultorFilter ||
      estadoFilter;

    if (!hayFiltros) {
      setShowModal(true);
      setModalData(
        modalMessages.error({
          message: "Debes ingresar al menos un filtro para buscar.",
        })
      );
      setLoading(false);
      return;
    }

    // ============================================
    // CONVERTIR VALORES DE INPUTS A IDs
    // ============================================
    const filtros = {};

    // 1️⃣ Convertir Nombre Comercial → idEmpresa
    if (orderNumberFilter) {
      const empresaEncontrada = razonesSociales.find(
        (empresa) =>
          empresa.nombrecomercial.toLowerCase() ===
          orderNumberFilter.toLowerCase()
      );

      if (empresaEncontrada) {
        filtros.idEmpresa = empresaEncontrada.id;
        console.log(
          `✅ Empresa encontrada: ${orderNumberFilter} → ID ${empresaEncontrada.id}`
        );
      } else {
        setShowModal(true);
        setModalData(
          modalMessages.error({
            message: `No se encontró la empresa "${orderNumberFilter}". Selecciona una empresa válida de la lista.`,
          })
        );
        setLoading(false);
        return;
      }
    }

    // 2️⃣ Código de Requerimiento (ya es string, se pasa directo)
    if (codigoFilter && codigoFilter.trim() !== "") {
      filtros.codRequerimiento = codigoFilter.trim();
      console.log(`✅ Código de requerimiento: ${filtros.codRequerimiento}`);
    }

    // 3️⃣ Convertir fechas a formato yyyy-MM-dd
    if (startDate) {
      filtros.fechaInicio = format(startDate, "yyyy-MM-dd");
      console.log(`✅ Fecha inicio: ${filtros.fechaInicio}`);
    }

    if (endDate) {
      filtros.fechaFin = format(endDate, "yyyy-MM-dd");
      console.log(`✅ Fecha fin: ${filtros.fechaFin}`);
    }

    // 4️⃣ Convertir Nombre Cliente → idUsuario
    if (clienteFilter) {
      const clienteEncontrado = clientes.find(
        (cliente) =>
          cliente.nombreCompleto.toLowerCase() === clienteFilter.toLowerCase()
      );

      if (clienteEncontrado) {
        filtros.idUsuario = clienteEncontrado.id;
        console.log(
          `✅ Cliente encontrado: ${clienteFilter} → ID ${clienteEncontrado.id}`
        );
      } else {
        setShowModal(true);
        setModalData(
          modalMessages.error({
            message: `No se encontró el cliente "${clienteFilter}". Selecciona un cliente válido de la lista.`,
          })
        );
        setLoading(false);
        return;
      }
    }

    // ✅ DESPUÉS (corregido):
    // 5️⃣ Número de Ticket (convertir string a número)
    if (idCodigoFilter) {
      const idRequerimientoStr = idCodigoFilter.toString().trim();
      if (idRequerimientoStr !== "") {
        const idRequerimiento = parseInt(idRequerimientoStr, 10);
        if (!isNaN(idRequerimiento)) {
          filtros.idRequerimiento = idRequerimiento;
          console.log(`✅ ID Requerimiento: ${filtros.idRequerimiento}`);
        }
      }
    }

    // 6️⃣ Convertir Descripción Estado → idEstadoRequerimiento
    if (estadoFilter) {
      const estadoEncontrado = estados.find(
        (estado) =>
          estado.descripcion.toLowerCase() === estadoFilter.toLowerCase()
      );

      if (estadoEncontrado) {
        filtros.idEstadoRequerimiento = estadoEncontrado.idEstadoRequerimiento;
        console.log(
          `✅ Estado encontrado: ${estadoFilter} → ID ${estadoEncontrado.idEstadoRequerimiento}`
        );
      } else {
        setShowModal(true);
        setModalData(
          modalMessages.error({
            message: `No se encontró el estado "${estadoFilter}". Selecciona un estado válido de la lista.`,
          })
        );
        setLoading(false);
        return;
      }
    }

    // C) DESPUÉS de estadoFilter, ANTES de LLAMAR AL SERVICIO:
    if (consultorFilter && consultorFilter.trim() !== "") {
      filtros.nombreConsultor = consultorFilter.trim();
      console.log(`✅ Consultor: ${filtros.nombreConsultor}`);
    }

    // ============================================
    // LLAMAR AL SERVICIO DE FILTRADO
    // ============================================
    console.log("🚀 Aplicando filtros:", filtros);

    const response = await FiltrarRequerimientos(filtros, accessToken, 0, 10);

    // Actualizar el estado con los resultados
    setRequerimientos(response.content);
    setRequerimientosPage(0);
    setRequerimientosHasMore(!response.last);
    setTotalRequerimientos(response.totalElements);
    setRequerimientosCargados(response.content.length);

    // Mostrar mensaje de éxito
    // setShowModal(true);
    // setModalData(
    //   modalMessages.success({
    //     message: `Se encontraron ${response.totalElements} requerimiento(s) que coinciden con los filtros.`,
    //   })
    // );

    console.log("✅ Filtrado exitoso:", response);
  } catch (error) {
    console.error("❌ Error al aplicar filtros:", error);
    setShowModal(true);
    setModalData(modalMessages.error({ message: error.message }));
  } finally {
    setLoading(false);
  }
};
