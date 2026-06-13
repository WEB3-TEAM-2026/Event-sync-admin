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
  NumberInput,
  SelectInput,
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
  Labeled,
  useGetList,
  Loading,
  SelectArrayInput,
} from "react-admin";
import {
  Chip,
  Box,
  Typography,
  Avatar,
  AvatarGroup,
  Tooltip,
} from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PeopleIcon from "@mui/icons-material/People";
import { RaRecord } from "react-admin";

//Live Badge
const LiveBadge = () => {
  const record = useRecordContext();
  if (!record) return null;
  const now = new Date();
  const isLive =
    new Date(record.startTime) <= now && new Date(record.endTime) >= now;
  if (!isLive) return null;
  return (
    <Chip
      icon={<PlayCircleIcon sx={{ fontSize: "14px !important" }} />}
      label="LIVE"
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
const SessionStatus = () => {
  const record = useRecordContext();
  if (!record) return null;
  const now = new Date();
  const start = new Date(record.startTime);
  const end = new Date(record.endTime);
  if (now >= start && now <= end) {
    return (
      <Chip label="En cours" size="small" sx={{ bgcolor: "#fef2f2", color: "#ef4444", fontWeight: 600 }} />
    );
  }
  if (now > end) {
    return (
      <Chip label="Terminée" size="small" sx={{ bgcolor: "#f3f4f6", color: "#6b7280", fontWeight: 600 }} />
    );
  }
  return (
    <Chip label="À venir" size="small" sx={{ bgcolor: "#eff6ff", color: "#3b82f6", fontWeight: 600 }} />
  );
};

//Speakers Avatars
const SpeakerAvatars = () => {
  const record = useRecordContext();
  const speakers = record?.speakers || [];
  if (speakers.length === 0)
    return <Typography variant="caption" color="text.secondary">—</Typography>;
  return (
    <AvatarGroup max={3} sx={{ justifyContent: "flex-start" }}>
      {speakers.map((s: RaRecord) => (
        <Tooltip key={s.id} title={s.fullName}>
          <Avatar
            src={s.profilePhoto}
            alt={s.fullName}
            sx={{ width: 28, height: 28, fontSize: "0.7rem" }}
          >
            {s.fullName?.[0]}
          </Avatar>
        </Tooltip>
      ))}
    </AvatarGroup>
  );
};

// Duration Field
const DurationField = () => {
  const record = useRecordContext();
  if (!record) return null;
  const start = new Date(record.startTime);
  const end = new Date(record.endTime);
  const minutes = Math.round((end.getTime() - start.getTime()) / 60000);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const label = h > 0 ? `${h}h${m > 0 ? m : ""}` : `${m}min`;
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <AccessTimeIcon sx={{ fontSize: 14, color: "#9ca3af" }} />
      <Typography variant="body2" color="text.secondary">{label}</Typography>
    </Box>
  );
};

// Selects with data fetching
const RoomSelectInput = () => {
  const { data: rooms, isLoading } = useGetList("rooms", { pagination: { page: 1, perPage: 100 }, sort: { field: "name", order: "ASC" } });
  if (isLoading) return <Loading />;
  const choices = (rooms || []).map((r) => ({ id: r.id, name: r.name }));
  return (
    <SelectInput
      source="roomId"
      label="Salle"
      choices={choices}
      validate={required("La salle est requise")}
    />
  );
};

const EventSelectInput = () => {
  const { data: events, isLoading } = useGetList("events", { pagination: { page: 1, perPage: 100 }, sort: { field: "title", order: "ASC" } });
  if (isLoading) return <Loading />;
  const choices = (events || []).map((e) => ({ id: e.id, name: e.title }));
  return (
    <SelectInput
      source="eventId"
      label="Événement"
      choices={choices}
      validate={required("L'événement est requis")}
    />
  );
};

const SpeakerMultiSelectInput = () => {
  const { data: speakers, isLoading } = useGetList("speakers", { pagination: { page: 1, perPage: 100 }, sort: { field: "fullName", order: "ASC" } });
  if (isLoading) return <Loading />;
  const choices = (speakers || []).map((s) => ({ id: s.id, name: s.fullName }));
  return (
    <SelectArrayInput
      source="speakerIds"
      label="Intervenants"
      choices={choices}
    />
  );
};

// List Actions
const ListActions = () => (
  <TopToolbar>
    <CreateButton label="Nouvelle session" />
    <ExportButton label="Exporter" />
  </TopToolbar>
);

//Session Form
const SessionFormFields = () => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 680 }}>
    <TextInput
      source="title"
      label="Titre"
      validate={required("Le titre est requis")}
      fullWidth
    />
    <TextInput
      source="description"
      label="Description"
      multiline
      rows={4}
      fullWidth
    />
    <Box sx={{ display: "flex", gap: 2 }}>
      <DateTimeInput
        source="startTime"
        label="Heure de début"
        validate={required("L'heure de début est requise")}
      />
      <DateTimeInput
        source="endTime"
        label="Heure de fin"
        validate={required("L'heure de fin est requise")}
      />
    </Box>
    <Box sx={{ display: "flex", gap: 2 }}>
      <EventSelectInput />
      <RoomSelectInput />
    </Box>
    <NumberInput source="capacity" label="Capacité (indicative)" min={1} />
    <SpeakerMultiSelectInput />
  </Box>
);

//SessionList
export const SessionList = () => (
  <List
    actions={<ListActions />}
    sort={{ field: "startTime", order: "ASC" }}
    perPage={15}
    title="Sessions"
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
      <FunctionField label="Statut" render={() => <SessionStatus />} />
      <DateField source="startTime" label="Début" showTime locales="fr-FR" options={{ dateStyle: "short", timeStyle: "short" }} />
      <FunctionField label="Durée" render={() => <DurationField />} />
      <FunctionField
        label="Salle"
        render={(record: RaRecord) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <MeetingRoomIcon sx={{ fontSize: 14, color: "#9ca3af" }} />
            <Typography variant="body2">{record.room?.name || "—"}</Typography>
          </Box>
        )}
      />
      <FunctionField label="Intervenants" render={() => <SpeakerAvatars />} />
      <FunctionField
        label="Capacité"
        render={(record: RaRecord) => (
          record.capacity ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <PeopleIcon sx={{ fontSize: 14, color: "#9ca3af" }} />
              <Typography variant="body2">{record.capacity}</Typography>
            </Box>
          ) : <Typography variant="caption" color="text.secondary">—</Typography>
        )}
      />
      <FunctionField label="Live" render={() => <LiveBadge />} />
      <WrapperField label="Actions">
        <ShowButton />
        <EditButton />
        <DeleteButton />
      </WrapperField>
    </Datagrid>
  </List>
);

// SessionShow
const ShowActions = () => (
  <TopToolbar>
    <EditButton />
    <DeleteButton />
  </TopToolbar>
);

export const SessionShow = () => (
  <Show actions={<ShowActions />} title="Détail session">
    <SimpleShowLayout>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Header Card */}
        <Box sx={{ p: 3, borderRadius: 2, bgcolor: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
            <TextField source="title" sx={{ fontSize: "1.25rem", fontWeight: 700 }} />
            <SessionStatus />
          </Box>
          <FunctionField
            render={(record: RaRecord) => {
              const now = new Date();
              const isLive = new Date(record.startTime) <= now && new Date(record.endTime) >= now;
              return isLive ? (
                <Chip
                  icon={<PlayCircleIcon sx={{ fontSize: "14px !important" }} />}
                  label="EN DIRECT"
                  sx={{ bgcolor: "#ef4444", color: "white", fontWeight: 700 }}
                />
              ) : null;
            }}
          />
        </Box>

        <Labeled label="Description">
          <TextField source="description" />
        </Labeled>

        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          <Labeled label="Heure de début">
            <DateField source="startTime" showTime locales="fr-FR" options={{ dateStyle: "long", timeStyle: "short" }} />
          </Labeled>
          <Labeled label="Heure de fin">
            <DateField source="endTime" showTime locales="fr-FR" options={{ dateStyle: "long", timeStyle: "short" }} />
          </Labeled>
          <Labeled label="Capacité">
            <NumberField source="capacity" />
          </Labeled>
        </Box>

        <Labeled label="Salle">
          <FunctionField render={(r: RaRecord) => (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <MeetingRoomIcon sx={{ color: "#6b7280" }} />
              <Typography>{r.room?.name || "—"}</Typography>
            </Box>
          )} />
        </Labeled>

        <Labeled label="Événement">
          <FunctionField render={(r: RaRecord) => (
            <Typography>{r.event?.title || "—"}</Typography>
          )} />
        </Labeled>

        <Labeled label="Intervenants">
          <FunctionField render={(r: RaRecord) => {
            const speakers = r.speakers || [];
            if (speakers.length === 0)
              return <Typography color="text.secondary">Aucun intervenant</Typography>;
            return (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {speakers.map((s: RaRecord) => (
                  <Chip
                    key={s.id}
                    avatar={<Avatar src={s.profilePhoto} alt={s.fullName}>{s.fullName?.[0]}</Avatar>}
                    label={s.fullName}
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            );
          }} />
        </Labeled>

        {/* Questions */}
        <Box>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>
            Questions
          </Typography>
          <FunctionField render={(r: RaRecord) => {
            const questions = r.questions || [];
            if (questions.length === 0)
              return <Typography color="text.secondary" variant="body2">Aucune question</Typography>;
            return (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {questions.map((q: RaRecord) => (
                  <Box
                    key={q.id}
                    sx={{
                      p: 2,
                      borderRadius: 1.5,
                      bgcolor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box>
                      <Typography variant="body2">{q.content}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {q.authorName || "Anonyme"} · {new Date(q.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </Typography>
                    </Box>
                    <Chip
                      label={`↑ ${q.upvotes}`}
                      size="small"
                      sx={{ bgcolor: "#eff1ff", color: "#5b6cf9", fontWeight: 700, minWidth: 48 }}
                    />
                  </Box>
                ))}
              </Box>
            );
          }} />
        </Box>
      </Box>
    </SimpleShowLayout>
  </Show>
);

// SessionCreate
export const SessionCreate = () => (
  <Create title="Nouvelle session" redirect="list">
    <SimpleForm>
      <SessionFormFields />
    </SimpleForm>
  </Create>
);

// SessionEdit
export const SessionEdit = () => (
  <Edit title="Modifier la session" redirect="list">
    <SimpleForm>
      <SessionFormFields />
    </SimpleForm>
  </Edit>
);
