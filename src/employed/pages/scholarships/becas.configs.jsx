import SchoolIcon from "@mui/icons-material/School";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import PersonIcon from "@mui/icons-material/Person";

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
    defaultValue: "",
    valueFormatter: (value) =>
      value === true || value === "true" ? "Sí" : "No",
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
    field: "nombre_proyecto_investigacion",
    headerName: "Nombre",
    minWidth: 350,
    flex: 1,
    defaultValue: "",
    form: {
      type: "text",
      visible: true,
      fullRow: true,
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
    },
  },

  {
    field: "activo",
    headerName: "Activo",
    width: 100,
    defaultValue: "",

    valueFormatter: (value) =>
      value === true || value === "true" ? "Sí" : "No",
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
    field: "legajo",
    headerName: "Legajo",
    width: 150,
    defaultValue: "",
    form: {
      type: "text",
      visible: true,
    },
  },
  {
    field: "aceptado_inicio",
    headerName: "Aceptado al Inicio",
    minWidth: 170,
    flex: 1,
    defaultValue: "",
    valueFormatter: (value) =>
      value === true || value === "true" ? "Sí" : "No",
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
    field: "puede_pagarle",
    headerName: "Puede Pagarle",
    minWidth: 170,
    flex: 1,
    defaultValue: "",
    valueFormatter: (value) =>
      value === true || value === "true" ? "Sí" : "No",
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
    field: "anio_beca",
    headerName: "Año de Beca",
    minWidth: 170,
    flex: 1,
    defaultValue: "",
    form: {
      type: "text",
      visible: true,
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
        icon: FitnessCenterIcon,
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
        icon: PersonIcon,
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

export const becasGridConfig = {
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
        },
      },
    ],
  },
  investigacion: {
    columns: [
      {
        field: "id_proyecto_investigacion",
        headerName: "Proyecto de Investigación",
        width: 70,
        defaultValue: "0",
        form: {
          type: "number",
          visible: true,
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
        },
      },
    ],
  },
  servicios: {
    columns: [
      {
        field: "id_Servicio",
        headerName: "Servicio",
        width: 70,
        defaultValue: "0",
        form: {
          type: "number",
          visible: true,
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
        },
      },
    ],
  },
};
