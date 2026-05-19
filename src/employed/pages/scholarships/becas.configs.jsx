import SchoolIcon from "@mui/icons-material/School";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import PersonIcon from "@mui/icons-material/Person";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import PeopleIcon from "@mui/icons-material/People";
const proyectosColumns = [
  {
    field: "id",
    headerName: "ID",
    width: 70,
    defaultValue: 0,
    form: {
      type: "number",
      disabledOnEdit: true,
      visible: true,
    },
  },

  {
    field: "activo",
    headerName: "Activo",
    width: 100,
    defaultValue: false,
    valueFormatter: (value) => (value ? "Sí" : "No"),
    form: {
      type: "switch",
      visible: true,
    },
  },
  {
    field: "nombre_proyecto_investigacion",
    headerName: "Nombre",
    minWidth: 350,
    flex: 1,
    defaultValue: "",
    form: {
      type: "text",
      visible: true,
      fullRow: true,
      required: true,
      requiredMessage: "El nombre del proyecto es obligatorio",
    },
  },

  {
    field: "centro_investigacion",
    headerName: "Centro de Investigación",
    minWidth: 350,
    flex: 1,
    defaultValue: "",
    form: {
      type: "text",
      visible: true,
      fullRow: true,
      required: true,
      requiredMessage: "El nombre del centro de investigación es obligatorio",
    },
  },
];

const serviciosColumns = [
  {
    field: "id",
    headerName: "ID",
    width: 70,
    defaultValue: 0,
    form: {
      type: "number",
      disabledOnEdit: true,
      fullRow: true,
    },
  },
  {
    field: "nombre",
    headerName: "Nombre",
    minWidth: 250,
    flex: 1,
    defaultValue: "",
    form: {
      type: "text",
      visible: true,
      fullRow: true,
      required: true,
      requiredMessage: "El nombre del servicio es obligatorio",
    },
  },
  {
    field: "nro_telefono",
    headerName: "Número de Teléfono",
    minWidth: 100,
    flex: 1,
    defaultValue: "",
    form: {
      type: "text",
      visible: true,
      required: true,
      requiredMessage: "El número de teléfono es obligatorio",
    },
  },
  {
    field: "nro_telefono_interno",
    headerName: "Número de Teléfono Interno",
    minWidth: 250,
    flex: 1,
    defaultValue: "",
    form: {
      type: "text",
      visible: true,
      required: true,
      requiredMessage: "El número de teléfono interno es obligatorio",
    },
  },
  {
    field: "email_institucional",
    headerName: "Email Institucional",
    minWidth: 250,
    flex: 1,
    defaultValue: "",
    form: {
      type: "email",
      visible: true,
      fullRow: true,
      required: true,
      requiredMessage: "El email institucional es obligatorio",
    },
  },
  {
    field: "horario_atencion",
    headerName: "Horario de Atención",
    minWidth: 170,
    flex: 1,
    defaultValue: "",
    form: {
      type: "time",
      visible: true,
      step: 300,
    },
  },

  {
    field: "horario_atencion_final",
    headerName: "Horario de Atención Final",
    minWidth: 170,
    flex: 1,
    defaultValue: "",
    form: {
      type: "time",
      visible: true,
      step: 300,
    },
  },
];

const becariosColumns = [
  {
    field: "id",
    headerName: "ID",
    width: 70,
    defaultValue: 0,
    form: {
      type: "number",
      disabledOnEdit: true,
      fullRow: true,
    },
  },
  {
    field: "legajo",
    headerName: "Legajo",
    form: {
      type: "user-search",
      visible: true,
      fullRow: true,
    },
  },

  {
    field: "activo",
    headerName: "Activo",
    width: 100,
    defaultValue: false,

    valueFormatter: (value) => (value ? "Sí" : "No"),
    form: {
      type: "switch",
      visible: true,
    },
  },

  {
    field: "aceptado_inicio",
    headerName: "Aceptado al Inicio",
    minWidth: 170,
    flex: 1,
    defaultValue: false,
    valueFormatter: (value) => (value ? "Sí" : "No"),
    form: {
      type: "switch",
      visible: true,
    },
  },
  {
    field: "puede_pagarle",
    headerName: "Puede Pagarle",
    minWidth: 170,
    flex: 1,
    defaultValue: false,
    valueFormatter: (value) => (value ? "Sí" : "No"),
    form: {
      type: "switch",
      visible: true,
      fullRow: true,
    },
  },

  {
    field: "anio_beca",
    headerName: "Año de Beca",
    minWidth: 170,
    flex: 1,
    defaultValue: "",
    form: {
      type: "text",
      visible: true,
      required: true,
      requiredMessage: "El año de la beca es obligatorio",
    },
  },
  {
    field: "id_becario_previo",
    headerName: "ID Becario Previo",
    minWidth: 170,
    flex: 1,
    defaultValue: "",
    form: {
      type: "number",
      visible: true,
    },
  },
];

export const createEmptyObject = (columns) =>
  columns.reduce((acc, column) => {
    acc[column.field] = column.defaultValue;
    return acc;
  }, {});

export const createSectionConfig = ({
  proyectosRows,
  loadingProyectos,
  serviciosRows,
  loadingServicios,
  becariosRows,
  loadingBecarios,
}) => ({
  configs: {
    title: "configs",
    sections: {
      proyectos: {
        title: "Gestión Proyectos de Investigación",
        tabTitle: "Proyectos",
        icon: SchoolIcon,
        rows: proyectosRows,
        columns: proyectosColumns,
        loading: loadingProyectos,
        actionButton: {
          textNew: "Nuevo proyecto",
          textEdit: "Editar proyecto",
          textView: "Ver proyecto",
        },
        emptyEntity: createEmptyObject(proyectosColumns),
      },

      servicios: {
        title: "Gestión Servicios Internos",
        tabTitle: "Servicios",
        icon: PrivacyTipIcon,
        rows: serviciosRows,
        columns: serviciosColumns,
        loading: loadingServicios,
        actionButton: {
          textNew: "Nuevo servicio",
          textEdit: "Editar servicio",
          textView: "Ver servicio",
        },
        emptyEntity: createEmptyObject(serviciosColumns),
      },
    },
  },

  becarios: {
    title: "Becarios",
    sections: {
      becarios: {
        title: "Gestión Becarios",
        tabTitle: "Becarios",
        icon: PeopleIcon,
        rows: becariosRows,
        columns: becariosColumns,
        loading: loadingBecarios,
        actionButton: {
          textNew: "Nuevo becario",
          textEdit: "Editar becario",
          textView: "Ver becario",
        },
        emptyEntity: createEmptyObject(becariosColumns),
      },
    },
  },
});

export const becasGridConfig = (serviciosRows, proyectosRows) => ({
  economica: {
    columns: [
      {
        field: "entrevista_realizada",
        headerName: "Entrevista realizada",
        width: 70,
        defaultValue: "false",
        form: {
          type: "select",
          visible: true,
          options: [
            { value: "true", label: "Sí" },
            { value: "false", label: "No" },
          ],
        },
      },
      {
        field: "modulos_asignados",
        headerName: "Módulos asignados",
        width: 70,
        defaultValue: "0",
        form: {
          type: "number",
          visible: true,
          min: 0,
          max: 3,
        },
      },
    ],
  },
  investigacion: {
    columns: [
      {
        // Usá acá el nombre real de la FK que devuelve/espera tu API.
        // Si tu backend usa otro campo, cambiá solo este field.
        field: "proyecto_investigacion.id",
        headerName: "Proyecto de Investigación",
        width: 70,
        defaultValue: "",
        form: {
          type: "select",
          visible: true,
          options: proyectosRows,
          value: "id",
          label: "nombre_proyecto_investigacion",
          fullRow: true,
        },
      },
      {
        field: "modulos_asignados",
        headerName: "Módulos asignados",
        width: 70,
        defaultValue: "0",
        form: {
          type: "number",
          visible: true,
          min: 0,
          max: 3,
        },
      },
    ],
  },
  servicio: {
    columns: [
      {
        // Usá acá el nombre real de la FK que devuelve/espera tu API.
        // Si tu backend usa otro campo, cambiá solo este field.
        field: "servicio.id",
        headerName: "Servicio",
        width: 70,
        defaultValue: "",
        form: {
          type: "select",
          visible: true,
          options: serviciosRows,
          value: "id",
          label: "nombre",
          fullRow: true,
        },
      },
      {
        field: "modulos_asignados",
        headerName: "Módulos asignados",
        width: 70,
        defaultValue: "0",
        form: {
          type: "number",
          visible: true,
          min: 0,
          max: 3,
        },
      },
    ],
  },
});
