import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  Show,
  SimpleShowLayout,
  Create,
  Edit,
  SimpleForm,
  TextInput,
  DateTimeInput,
  required,
  TopToolbar,
  EditButton,
  ShowButton,
  DeleteButton,
  CreateButton,
  ExportButton,
  useRecordContext,
  ReferenceManyField,
  FunctionField,
  Labeled,
  WrapperField,
  BulkDeleteButton,
} from "react-admin";
import { Chip, Box, Typography } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { RaRecord } from "react-admin";

// ─── Badge Live ───────────────────────────────────────────────────────────────
const LiveChip = () => {
  const record = useRecordContext();
  if (!record?.sessions) return null;
  const now = new Date();
  const liveSessions = record.sessions.filter(
    (s: RaRecord) =>
      new Date(s.startTime) <= now && new Date(s.endTime) >= now
  );
  if (liveSessions.length === 0) return null;
  return (
    <Chip
      label={`${liveSessions.length} LIVE`}
      size="small"
      sx={{
        bgcolor: "#fef2f2",
        color: "#ef4444",
        border: "1px solid #fecaca",
        fontWeight: 700,
        fontSize: "0.65rem",
        animation: "pulse 1.5s infinite",
        "@keyframes pulse": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.6 },
        },
      }}
    />
  );
};

// Status Chip
const StatusChip = () => {
  const record = useRecordContext();
  if (!record) return null;
  const now = new Date();
  const start = new Date(record.startDate);
  const end = new Date(record.endDate);
  let label = "À venir";
  let color = "#e8f4fd";
  let textColor = "#1976d2";
  if (now >= start && now <= end) {
    label = "En cours";
    color = "#ecfdf5";
    textColor = "#10b981";
  } else if (now > end) {
    label = "Terminé";
    color = "#f3f4f6";
    textColor = "#6b7280";
  }
  return (
    <Chip
      label={label}
      size="small"
      sx={{ bgcolor: color, color: textColor, fontWeight: 600, border: "none" }}
    />
  );
};

//Session Count
const SessionCount = () => {
  const record = useRecordContext();
  const count = record?.sessions?.length ?? 0;
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <Typography variant="body2" fontWeight={600}>{count}</Typography>
      <Typography variant="caption" color="text.secondary">session{count !== 1 ? "s" : ""}</Typography>
    </Box>
  );
};

//List Actions
const ListActions = () => (
  <TopToolbar>
    <CreateButton label="Nouvel événement" />
    <ExportButton label="Exporter" />
  </TopToolbar>
);

//EventList
export const EventList = () => (
  <List
    actions={<ListActions />}
    sort={{ field: "startDate", order: "ASC" }}
    perPage={10}
    title="Événements"
    sx={{ "& .RaList-content": { borderRadius: 2, overflow: "hidden" } }}
  >
    <Datagrid
      bulkActionButtons={<BulkDeleteButton />}
      sx={{
        "& .RaDatagrid-headerCell": {
          backgroundColor: "#f8fafc",
          fontWeight: 700,
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "#64748b",
        },
        "& .RaDatagrid-row:hover": { backgroundColor: "#f8fafc" },
      }}
    >
      <TextField source="title" label="Titre" />
      <FunctionField
        label="Statut"
        render={() => <StatusChip />}
      />
      <DateField source="startDate" label="Début" locales="fr-FR" options={{ dateStyle: "medium" }} />
      <DateField source="endDate" label="Fin" locales="fr-FR" options={{ dateStyle: "medium" }} />
      <TextField source="location" label="Lieu" />
      <FunctionField label="Sessions" render={() => <SessionCount />} />
      <FunctionField label="Live" render={() => <LiveChip />} />
      <WrapperField label="Actions">
        <ShowButton />
        <EditButton />
        <DeleteButton />
      </WrapperField>
    </Datagrid>
  </List>
);

//EventShow
const ShowActions = () => (
  <TopToolbar>
    <EditButton />
    <DeleteButton />
  </TopToolbar>
);

export const EventShow = () => (
  <Show actions={<ShowActions />} title="Détail événement">
    <SimpleShowLayout>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Header */}
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            background: "linear-gradient(135deg, #5b6cf9 0%, #a78bfa 100%)",
            color: "white",
          }}
        >
          <FunctionField
            render={(record: RaRecord) => (
              <Typography variant="h5" fontWeight={700}>{record.title}</Typography>
            )}
          />
          <Box sx={{ display: "flex", gap: 2, mt: 1, flexWrap: "wrap" }}>
            <FunctionField
              render={(record: RaRecord) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, opacity: 0.9 }}>
                  <LocationOnIcon sx={{ fontSize: 16 }} />
                  <Typography variant="body2">{record.location}</Typography>
                </Box>
              )}
            />
            <FunctionField
              render={(record: RaRecord) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, opacity: 0.9 }}>
                  <CalendarMonthIcon sx={{ fontSize: 16 }} />
                  <Typography variant="body2">
                    {new Date(record.startDate).toLocaleDateString("fr-FR")}
                    {" → "}
                    {new Date(record.endDate).toLocaleDateString("fr-FR")}
                  </Typography>
                </Box>
              )}
            />
          </Box>
        </Box>

        {/* Description */}
        <Labeled label="Description">
          <TextField source="description" />
        </Labeled>

        {/* Dates */}
        <Box sx={{ display: "flex", gap: 3 }}>
          <Labeled label="Date de début">
            <DateField source="startDate" locales="fr-FR" options={{ dateStyle: "long" }} />
          </Labeled>
          <Labeled label="Date de fin">
            <DateField source="endDate" locales="fr-FR" options={{ dateStyle: "long" }} />
          </Labeled>
        </Box>

        {/* Sessions */}
        <Box>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>Sessions</Typography>
          <ReferenceManyField reference="sessions" target="eventId" label="">
            <Datagrid bulkActionButtons={false} sx={{ "& .RaDatagrid-headerCell": { bgcolor: "#f8fafc" } }}>
              <TextField source="title" label="Titre" />
              <DateField source="startTime" label="Début" showTime locales="fr-FR" />
              <DateField source="endTime" label="Fin" showTime locales="fr-FR" />
              <TextField source="room.name" label="Salle" />
              <NumberField source="capacity" label="Capacité" />
              <FunctionField
                label="Live"
                render={(record: RaRecord) => {
                  const now = new Date();
                  const isLive =
                    new Date(record.startTime) <= now &&
                    new Date(record.endTime) >= now;
                  return isLive ? (
                    <Chip label="LIVE" size="small" sx={{ bgcolor: "#fef2f2", color: "#ef4444", fontWeight: 700 }} />
                  ) : null;
                }}
              />
              <EditButton resource="sessions" />
            </Datagrid>
          </ReferenceManyField>
        </Box>
      </Box>
    </SimpleShowLayout>
  </Show>
);

//End date validator (field-level)
const validateEndAfterStart = (endDate: string, allValues: Record<string, string>) => {
  if (endDate && allValues.startDate && new Date(endDate) <= new Date(allValues.startDate)) {
    return "La date de fin doit être après la date de début";
  }
  return undefined;
};

//Shared form fields
const EventFormFields = () => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 600 }}>
    <TextInput source="title" label="Titre" validate={required("Le titre est requis")} fullWidth />
    <TextInput source="description" label="Description" validate={required("La description est requise")} multiline rows={4} fullWidth />
    <TextInput source="location" label="Lieu" validate={required("Le lieu est requis")} fullWidth />
    <Box sx={{ display: "flex", gap: 2 }}>
      <DateTimeInput source="startDate" label="Date de début" validate={required("La date de début est requise")} />
      <DateTimeInput
        source="endDate"
        label="Date de fin"
        validate={[required("La date de fin est requise"), validateEndAfterStart as any]}
      />
    </Box>
  </Box>
);

// EventCreate
export const EventCreate = () => (
  <Create title="Nouvel événement" redirect="list">
    <SimpleForm>
      <EventFormFields />
    </SimpleForm>
  </Create>
);

// EventEdit
export const EventEdit = () => (
  <Edit title="Modifier l'événement" redirect="list">
    <SimpleForm>
      <EventFormFields />
    </SimpleForm>
  </Edit>
);
