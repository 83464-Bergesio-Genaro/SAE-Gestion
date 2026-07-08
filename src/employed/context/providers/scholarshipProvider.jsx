import {useState, useEffect,useCallback} from "react";
import { ScholarshipContext } from "../employedContext";
import { useNotification } from "../../../shared/context/sharedContext";

import {
  ObtenerProyectosInvestigacion,
  ObtenerBecariosCompleto,
  ObtenerServiciosInternos,
  CrearServicioInterno,
  CrearProyectoInvestigacion,
  EditarProyectoInvestigacion,
  EditarServicioInterno,
  ObtenerBecariosEconomicaXLegajo,
  ObtenerBecariosServiciosXLegajo,
  ObtenerBecariosInvestigacionXLegajo,
  ObtenerBecariosXLegajo,
  ObtenerUsuariosXLegajo,
  CrearBecarioSAE,
  CrearBecarioEconomica,
  CrearBecarioInvestigacion,
  CrearBecarioServicio,
  EditarBecarioSAE,
  EditarBecarioEconomica,
  EditarBecarioInvestigacion,
  EditarBecarioServicio,
} from "../../../api/BecasService";
import {
  getFirstRecord as getFirstRecordUtil,
  valuesAreEqual as valuesAreEqualUtil,
} from "../../../utils/util.jsx";;
import {
  becariosColumns,
  proyectosColumns,
  serviciosColumns,
} from "../../pages/scholarships/becas.configs";


export function ScholarshipProvider({ children }) {
  const { showNotification } = useNotification();

    const getFirstRecord = (value) => {
    // Los endpoints pueden devolver un objeto, una lista o una respuesta vacía.
    // El editor necesita siempre un objeto para poder pintar correctamente los campos.
    return getFirstRecordUtil(value);
    };

    async function handleBuscarBecario(legajo) {
    // Para el dialog de Becarios buscamos cada tipo de beca por separado y luego
    // devolvemos una lista uniforme para mostrarla en tabs.
    const [becasEconomicas, becasServicios, becasInvestigacion] =
    await Promise.all([
      ObtenerBecariosEconomicaXLegajo(legajo),
      ObtenerBecariosServiciosXLegajo(legajo),
      ObtenerBecariosInvestigacionXLegajo(legajo),
    ]);

    return [
        {
        tipo: "economica",
        nombre: "Beca económica",
        datos: getFirstRecord(becasEconomicas),
        },
        {
        tipo: "servicio",
        nombre: "Servicio interno",
        datos: getFirstRecord(becasServicios),
        },
        {
        tipo: "investigacion",
        nombre: "Investigación",
        datos: getFirstRecord(becasInvestigacion),
        },
    ].filter((beca) => Boolean(beca.datos));
    }

    async function handleBuscarBecarioPorLegajo(legajo) {
    const becario = await ObtenerUsuariosXLegajo(String(legajo).trim());
    return getFirstRecord(becario);
    }

    const getNombreBecario = (data = {}) =>
    data.nombre_becario ??
    data.nombre_usuario ??
    data.nombre ??
    data.Nombre ??
    data.legajo ??
    "";

    // Payload base del becario SAE. La fecha de solicitud se conserva si vino de la
    // API; si no existe, queda en null para que no se actualice desde el front.
    const buildBecarioPayload = (data = {}) => ({
    id: data.id ?? 0,
    legajo: data.legajo,
    nombre_becario: getNombreBecario(data),
    alquila: data.alquila ?? false,
    fecha_solicitud: data.fecha_solicitud ?? null,
    aceptado_inicio: Boolean(data.aceptado_inicio),
    puede_pagarle: Boolean(data.puede_pagarle),
    activo: data.activo ?? true,
    anio_beca: data.anio_beca || new Date().getFullYear(),
    id_becario_previo: data.id_becario_previo || null,
    });

    const buildBecarioComparablePayload = (data = {}) => ({
    ...buildBecarioPayload(data),
    fecha_solicitud: data.fecha_solicitud ?? null,
    });

    const valuesAreEqual = (current, original) =>
    valuesAreEqualUtil(current, original);

    const getBecaId = (beca = {}) => beca.datos?.id ?? beca.id;

    async function crearBecaParaBecario(becarioId, beca = {}) {
    switch (beca.tipo) {
        case "economica":
        await CrearBecarioEconomica(becarioId);
        return;
        case "investigacion":
        await CrearBecarioInvestigacion(
            becarioId,
            beca["proyecto_investigacion.id"] ?? beca.proyecto_investigacion?.id,
        );
        return;
        case "servicio":
        await CrearBecarioServicio(
            becarioId,
            beca["servicio.id"] ?? beca.servicio?.id,
        );
        return;
        default:
        return;
    }
    }

    // Edita el registro base solo si los campos generales cambiaron. Esto evita
    // llamadas innecesarias y, sobre todo, evita pisar datos del becario al tocar
    // solamente una beca especifica.
    async function editarBecarioSiCambio(data = {}, originalData = {}) {
    const payload = buildBecarioPayload(data);
    const currentComparable = buildBecarioComparablePayload(data);
    const originalComparable = buildBecarioComparablePayload(originalData);

    if (valuesAreEqual(currentComparable, originalComparable)) return false;

    await EditarBecarioSAE(payload.id, payload);
    return true;
    }

    // Cada beca activa tiene su endpoint propio. Se compara contra el snapshot
    // original que tomo el dialog al abrirse y se llama solo al tipo modificado.
    async function editarBecaSiCambio(beca = {}, originalBeca = {}) {
    if (!beca?.datos || valuesAreEqual(beca.datos, originalBeca?.datos)) {
        return false;
    }

    const becaId = getBecaId(beca);
    if (!becaId) {
        throw new Error(`No se encontro el id de la beca ${beca.nombre}`);
    }

    switch (beca.tipo) {
        case "economica":
        await EditarBecarioEconomica(becaId, beca.datos);
        return true;
        case "investigacion":
        await EditarBecarioInvestigacion(becaId, beca.datos);
        return true;
        case "servicio":
        await EditarBecarioServicio(becaId, beca.datos);
        return true;
        default:
        return false;
    }
    }

    // Recorre todas las becas visibles del becario y acumula si alguna realmente se
    // guardo, para decidir despues si refrescar la grilla y que mensaje mostrar.
    async function editarBecasSiCambiaron(becas = [], originalBecas = []) {
    let huboCambios = false;

    for (const beca of becas) {
        const originalBeca = originalBecas.find(
        (item) => item.tipo === beca.tipo && getBecaId(item) === getBecaId(beca),
        );
        const cambioBeca = await editarBecaSiCambio(beca, originalBeca);

        huboCambios = huboCambios || cambioBeca;
    }

    return huboCambios;
    }
        
  // Cargas iniciales de los tres bloques principales de la pantalla:
  // proyectos, servicios y becarios.
  const fetchProyectosInvetigacion = useCallback(async () => {
    setLoadingProyectos(true);
    try {
      const data = await ObtenerProyectosInvestigacion();
      setProyectosRows(data);
    } catch (err) {
      setProyectosRows([]);
      console.error("Error al cargar proyectos de investigación:", err);
    } finally {
      setLoadingProyectos(false);
    }
  }, []);

  const fetchServiciosInternos = useCallback(async () => {
    setLoadingServicios(true);
    try {
      const data = await ObtenerServiciosInternos();
      setServiciosRows(data);
    } catch (err) {
      setServiciosRows([]);
      console.error("Error al cargar servicios internos:", err);
    } finally {
      setLoadingServicios(false);
    }
  }, []);

  const fetchBecariosCompleto = useCallback(async () => {
    setLoadingBecarios(true);
    try {
      const data = await ObtenerBecariosCompleto();
      setBecariosRows(data);
    } catch (err) {
      setBecariosRows([]);
      console.error("Error al cargar becarios completos:", err);
    } finally {
      setLoadingBecarios(false);
    }
  }, []);

  useEffect(() => {
    fetchProyectosInvetigacion();
    fetchServiciosInternos();
    fetchBecariosCompleto();
  }, [
    fetchProyectosInvetigacion,
    fetchServiciosInternos,
    fetchBecariosCompleto,
  ]);

  const [proyectosRows, setProyectosRows] = useState([]);
  const [loadingProyectos, setLoadingProyectos] = useState(true);

  const [serviciosRows, setServiciosRows] = useState([]);
  const [loadingServicios, setLoadingServicios] = useState(true);

  const [becariosRows, setBecariosRows] = useState([]);
  const [loadingBecarios, setLoadingBecarios] = useState(true);

  // Punto unico de guardado para los dialogs genericos. Segun la seccion activa
  // decide que endpoint usar y que grilla refrescar.
  const handleDialogSave = async ({
    cardKey,
    sectionKey,
    mode,
    data,
    originalData,
    becas,
    originalBecas,
  }) => {
    let mensajeSnackbar = "La accion se realizo exitosamente";
    try {
      switch (sectionKey) {
        case "proyectos":
          if (mode === "create") {
            await CrearProyectoInvestigacion(data);
            await fetchProyectosInvetigacion();
            mensajeSnackbar = "Proyecto de investigación creado exitosamente";
          }
          if (mode === "edit") {
            // Aquí iría la lógica para editar un proyecto de investigación
            await EditarProyectoInvestigacion(data.id, data);
            await fetchProyectosInvetigacion();
            mensajeSnackbar = "Proyecto de investigación editado exitosamente";
          }
          break;
        case "servicios":
          if (mode === "create") {
            await CrearServicioInterno(data);
            await fetchServiciosInternos();
            mensajeSnackbar = "Servicio interno creado exitosamente";
          }
          if (mode === "edit") {
            await EditarServicioInterno(data.id, data);
            await fetchServiciosInternos();
            mensajeSnackbar = "Servicio interno editado exitosamente";
          }
          break;
        case "becarios":
          if (mode === "create") {
            const nuevoBecario = await CrearBecarioSAE(
              buildBecarioPayload(data),
            );

            await crearBecaParaBecario(nuevoBecario.id, data.beca);
            await fetchBecariosCompleto();
            mensajeSnackbar = "Becario creado exitosamente";
          }
          if (mode === "edit") {
            const cambioBecario = await editarBecarioSiCambio(
              data,
              originalData,
            );
            const cambioBeca = await editarBecasSiCambiaron(
              becas,
              originalBecas,
            );

            if (cambioBecario || cambioBeca) {
              await fetchBecariosCompleto();
              mensajeSnackbar = "Becario editado exitosamente";
            } else {
              mensajeSnackbar = "No se detectaron cambios para guardar";
            }
          }
          break;
        default:
          console.warn(
            "No hay logica de guardado definida para esta card:",
            cardKey,
          );
      }

      showNotification(mensajeSnackbar, "success");
    } catch (err) {
      showNotification(err.message || "Ocurrio un error al guardar", "error");
      throw err;
    }
  };
      return (
        <ScholarshipContext.Provider
          value={{
            handleDialogSave,
            handleBuscarBecario,
            handleBuscarBecarioPorLegajo,

            proyectosRows,
            proyectosColumns,
            loadingProyectos,
            serviciosRows,
            serviciosColumns,
            loadingServicios,
            becariosRows,
            becariosColumns,
            loadingBecarios
          }}
        >
          {children}
        </ScholarshipContext.Provider>
      );
}
