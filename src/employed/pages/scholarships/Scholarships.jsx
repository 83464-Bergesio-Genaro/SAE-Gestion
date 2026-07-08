import { useMemo } from "react";
import PeopleIcon from "@mui/icons-material/People";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import SchoolIcon from "@mui/icons-material/School";
import { useScholarshipDialogController } from "./becas.utils";
import { becasGridConfig, createEmptyObject } from "./becas.configs";
import HeaderPageEmployed from "../../../shared/components/headerPageEmployed";
import SAEDataGrid from "../../../shared/components/dataGrid/SAEDataGrid";
import { ScholarshipProvider } from "../../context/providers/scholarshipProvider";
import { useScholarships } from "../../context/employedContext";
import SAEPage from "../../../shared/components/page/SAEPage";

export default function EmployedScholarships() {
  return (
    <ScholarshipProvider>
      <EmployedScholarshipsContent />
    </ScholarshipProvider>
  );
}

function EmployedScholarshipsContent() {
  const {
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
    loadingBecarios,
  } = useScholarships();

  const configuracionCard = useMemo(
    () => ({
      title: "Configuracion",
      sections: {
        proyectos: {
          title: "Gestion Proyectos de Investigacion",
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
          title: "Gestion Servicios Internos",
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
    }),
    [
      proyectosRows,
      proyectosColumns,
      loadingProyectos,
      serviciosRows,
      serviciosColumns,
      loadingServicios,
    ],
  );

  const becariosCard = useMemo(
    () => ({
      title: "Becarios",
      sections: {
        becarios: {
          title: "Gestion Becarios",
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
    }),
    [becariosRows, becariosColumns, loadingBecarios],
  );

  const commonDialogProps = {
    onSave: handleDialogSave,
    onBecario: handleBuscarBecario,
    onBuscarBecario: handleBuscarBecarioPorLegajo,
    becasGridConfig: becasGridConfig(serviciosRows, proyectosRows),
  };

  const configuracionDialog = useScholarshipDialogController({
    cardKey: "configuracion",
    card: configuracionCard,
    ...commonDialogProps,
  });

  const becariosDialog = useScholarshipDialogController({
    cardKey: "becarios",
    card: becariosCard,
    ...commonDialogProps,
  });

  const configuracionSections = useMemo(
    () =>
      Object.entries(configuracionCard.sections).reduce(
        (sections, [sectionKey, section]) => ({
          ...sections,
          [sectionKey]: {
            key: sectionKey,
            title: section.tabTitle,
            icon: section.icon,
            rows: section.rows,
            columns: configuracionDialog.getGridColumns(section, sectionKey),
            loading: section.loading,
            dialog: () => configuracionDialog.openCreate(sectionKey),
            addButton: section.actionButton.textNew,
          },
        }),
        {},
      ),
    [configuracionCard, configuracionDialog],
  );

  const becariosSections = useMemo(
    () =>
      Object.entries(becariosCard.sections).reduce(
        (sections, [sectionKey, section]) => ({
          ...sections,
          [sectionKey]: {
            key: sectionKey,
            title: section.tabTitle,
            icon: section.icon,
            rows: section.rows,
            columns: becariosDialog.getGridColumns(section, sectionKey),
            loading: section.loading,
            dialog: () => becariosDialog.openCreate(sectionKey),
            addButton: section.actionButton.textNew,
          },
        }),
        {},
      ),
    [becariosCard, becariosDialog],
  );

  return (
    <SAEPage>
      <HeaderPageEmployed
        header=" Modulo de Becas"
        title="Gestion de Becas"
        description="Administra becas, proyectos de investigacion y servicios desde un solo lugar."
      />

      <SAEDataGrid
        sectionConfig={configuracionSections}
        currentSection={configuracionDialog.activeSection}
        onSectionChange={configuracionDialog.setActiveSection}
      />
      {configuracionDialog.dialogs}

      <SAEDataGrid
        sectionConfig={becariosSections}
        currentSection={becariosDialog.activeSection}
        onSectionChange={becariosDialog.setActiveSection}
      />
      {becariosDialog.dialogs}
    </SAEPage>
  );
}
