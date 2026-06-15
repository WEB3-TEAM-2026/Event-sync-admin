import {
  List,
  Datagrid,
  Show,
  SimpleShowLayout,
  Create,
  Edit,
  SimpleForm,
  TextInput,
  required,
  TopToolbar,
  EditButton,
  ShowButton,
  DeleteButton,
  CreateButton,
  ExportButton,
  useRecordContext,
  FunctionField,
  WrapperField,
  BulkDeleteButton,
  DateField,
} from "react-admin";
import { Chip, Box, Typography } from "@mui/material";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import { RaRecord } from "react-admin";

//Session Count
const SessionCountChip = () => {
  const record = useRecordContext();
  const count = record?._count?.sessions ?? record?.sessions?.length ?? 0;
  return (
    <Chip
      label={`${count} session${count !== 1 ? "s" : ""}`}
      size="small"
      sx={{
        bgcolor: count > 0 ? "#eff1ff" : "#f3f4f6",
        color: count > 0 ? "#5b6cf9" : "#9ca3af",
        fontWeight: 600,
        border: "none",
      }}
    />
  );
};

// Room Name Cell
const RoomNameCell = () => {
  const record = useRecordContext();
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box
        sx={{
          p: 0.75,
          borderRadius: 1.5,
          bgcolor: "#eff1ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MeetingRoomIcon sx={{ fontSize: 16, color: "#5b6cf9" }} />
      </Box>
      <Typography variant="body2" fontWeight={600}>{record?.name}</Typography>
    </Box>
  );
};

//List Actions
const ListActions = () => (
  <TopToolbar>
    <CreateButton label="Nouvelle salle" />
    <ExportButton label="Exporter" />
  </TopToolbar>
);

// RoomList
export const RoomList = () => (
  <List
    actions={<ListActions />}
    sort={{ field: "name", order: "ASC" }}
    perPage={15}
    title="Salles"
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
      <FunctionField label="Nom" render={() => <RoomNameCell />} />
      <FunctionField label="Sessions" render={() => <SessionCountChip />} />
      <DateField source="createdAt" label="Créée le" locales="fr-FR" options={{ dateStyle: "medium" }} />
      <WrapperField label="Actions">
        <ShowButton />
        <EditButton />
        <DeleteButton />
      </WrapperField>
    </Datagrid>
  </List>
);

// RoomShow
const ShowActions = () => (
  <TopToolbar>
    <EditButton />
    <DeleteButton />
  </TopToolbar>
);

export const RoomShow = () => (
  <Show actions={<ShowActions />} title="Détail salle">
    <SimpleShowLayout>
      <FunctionField
        render={(record: RaRecord) => {
          const sessions = record.sessions || [];
          const now = new Date();
          return (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Room Header */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 3,
                  borderRadius: 2,
                  bgcolor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "#eff1ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MeetingRoomIcon sx={{ fontSize: 32, color: "#5b6cf9" }} />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={700}>{record.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {sessions.length} session{sessions.length !== 1 ? "s" : ""} assignée{sessions.length !== 1 ? "s" : ""}
                  </Typography>
                </Box>
              </Box>

              {/* Sessions in this room */}
              <Box>
                <Typography variant="subtitle1" fontWeight={700} mb={2}>
                  Sessions dans cette salle
                </Typography>
                {sessions.length === 0 ? (
                  <Box
                    sx={{
                      p: 3,
                      textAlign: "center",
                      borderRadius: 2,
                      bgcolor: "#f8fafc",
                      border: "1px dashed #e2e8f0",
                    }}
                  >
                    <Typography color="text.secondary" variant="body2">
                      Aucune session assignée à cette salle
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {sessions
                      .sort(
                        (a: RaRecord, b: RaRecord) =>
                          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
                      )
                      .map((s: RaRecord) => {
                        const isLive =
                          new Date(s.startTime) <= now && new Date(s.endTime) >= now;
                        const isPast = new Date(s.endTime) < now;
                        return (
                          <Box
                            key={s.id}
                            sx={{
                              p: 2,
                              borderRadius: 1.5,
                              border: "1px solid",
                              borderColor: isLive ? "#fecaca" : "#e2e8f0",
                              bgcolor: isLive ? "#fef2f2" : isPast ? "#f9fafb" : "#ffffff",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Box>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                {isLive && (
                                  <Chip
                                    label="LIVE"
                                    size="small"
                                    sx={{ bgcolor: "#ef4444", color: "white", fontWeight: 700, fontSize: "0.6rem" }}
                                  />
                                )}
                                <Typography
                                  variant="body2"
                                  fontWeight={600}
                                  color={isPast ? "text.secondary" : "text.primary"}
                                >
                                  {s.title}
                                </Typography>
                              </Box>
                              {s.event && (
                                <Typography variant="caption" color="text.secondary">
                                  {s.event.title}
                                </Typography>
                              )}
                            </Box>
                            <Box sx={{ textAlign: "right" }}>
                              <Typography variant="caption" color="text.secondary" display="block">
                                {new Date(s.startTime).toLocaleDateString("fr-FR")}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(s.startTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                                {" → "}
                                {new Date(s.endTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })}
                  </Box>
                )}
              </Box>
            </Box>
          );
        }}
      />
    </SimpleShowLayout>
  </Show>
);

// RoomCreate
export const RoomCreate = () => (
  <Create title="Nouvelle salle" redirect="list">
    <SimpleForm>
      <Box sx={{ maxWidth: 400 }}>
        <TextInput
          source="name"
          label="Nom de la salle"
          validate={required("Le nom est requis")}
          fullWidth
          helperText="Ex: Salle Amphi A, Atelier Innovation…"
        />
      </Box>
    </SimpleForm>
  </Create>
);

// RoomEdit
export const RoomEdit = () => (
  <Edit title="Modifier la salle" redirect="list">
    <SimpleForm>
      <Box sx={{ maxWidth: 400 }}>
        <TextInput
          source="name"
          label="Nom de la salle"
          validate={required("Le nom est requis")}
          fullWidth
        />
      </Box>
    </SimpleForm>
  </Edit>
);
