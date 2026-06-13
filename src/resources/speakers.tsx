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
} from "react-admin";
import {
  Chip,
  Box,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import LanguageIcon from "@mui/icons-material/Language";
import { RaRecord } from "react-admin";

// Social Icon Map
const SOCIAL_ICONS: Record<string, React.ElementType> = {
  LinkedIn: LinkedInIcon,
  Twitter: TwitterIcon,
  GitHub: GitHubIcon,
  Site: LanguageIcon,
  Blog: LanguageIcon,
};

// Speaker Avatar Cell
const SpeakerAvatar = () => {
  const record = useRecordContext();
  if (!record) return null;
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <Avatar
        src={record.profilePhoto}
        alt={record.fullName}
        sx={{ width: 36, height: 36, fontSize: "0.85rem", bgcolor: "#eff1ff" }}
      >
        {record.fullName?.[0]}
      </Avatar>
      <Box>
        <Typography variant="body2" fontWeight={600}>{record.fullName}</Typography>
      </Box>
    </Box>
  );
};

// External Links Cell
const ExternalLinksCell = () => {
  const record = useRecordContext();
  const links = record?.externalLinks as Record<string, string> | null;
  if (!links || Object.keys(links).length === 0)
    return <Typography variant="caption" color="text.secondary">—</Typography>;

  return (
    <Box sx={{ display: "flex", gap: 0.5 }}>
      {Object.entries(links).map(([label, url]) => {
        const Icon = SOCIAL_ICONS[label] || LanguageIcon;
        return (
          <Tooltip key={label} title={label}>
            <IconButton
              size="small"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              sx={{ color: "#5b6cf9" }}
            >
              <Icon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        );
      })}
    </Box>
  );
};

//Session Count Cell
const SessionCountCell = () => {
  const record = useRecordContext();
  const count = record?.sessions?.length ?? 0;
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

//Live Chip
const LiveCell = () => {
  const record = useRecordContext();
  if (!record?.sessions) return null;
  const now = new Date();
  const hasLive = record.sessions.some(
    (ss: RaRecord) =>
      new Date(ss.session?.startTime || ss.startTime) <= now &&
      new Date(ss.session?.endTime || ss.endTime) >= now
  );
  if (!hasLive) return null;
  return (
    <Chip
      label="LIVE"
      size="small"
      sx={{
        bgcolor: "#fef2f2",
        color: "#ef4444",
        border: "1px solid #fecaca",
        fontWeight: 700,
        fontSize: "0.65rem",
      }}
    />
  );
};

// Bio Truncated
const BioTruncated = () => {
  const record = useRecordContext();
  if (!record?.bio) return <Typography variant="caption" color="text.secondary">—</Typography>;
  const truncated = record.bio.length > 80 ? record.bio.slice(0, 80) + "…" : record.bio;
  return (
    <Tooltip title={record.bio}>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 240 }}>
        {truncated}
      </Typography>
    </Tooltip>
  );
};

//  ExternalLinks JSON Input helper
const ExternalLinksInput = () => (
  <Box>
    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
      Liens externes — format JSON (ex: {`{"LinkedIn":"https://...","Twitter":"https://..."}`})
    </Typography>
    <TextInput
      source="externalLinks"
      label="Liens externes (JSON)"
      fullWidth
      multiline
      rows={3}
      format={(val) => (val ? JSON.stringify(val, null, 2) : "")}
      parse={(val) => {
        try {
          return val ? JSON.parse(val) : null;
        } catch {
          return val;
        }
      }}
      helperText={`Clés suggérées : LinkedIn, Twitter, GitHub, Site, Blog`}
    />
  </Box>
);

// List Actions
const ListActions = () => (
  <TopToolbar>
    <CreateButton label="Nouvel intervenant" />
    <ExportButton label="Exporter" />
  </TopToolbar>
);

//SpeakerList
export const SpeakerList = () => (
  <List
    actions={<ListActions />}
    sort={{ field: "fullName", order: "ASC" }}
    perPage={15}
    title="Intervenants"
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
      <FunctionField label="Intervenant" render={() => <SpeakerAvatar />} />
      <FunctionField label="Bio" render={() => <BioTruncated />} />
      <FunctionField label="Sessions" render={() => <SessionCountCell />} />
      <FunctionField label="Live" render={() => <LiveCell />} />
      <FunctionField label="Liens" render={() => <ExternalLinksCell />} />
      <WrapperField label="Actions">
        <ShowButton />
        <EditButton />
        <DeleteButton />
      </WrapperField>
    </Datagrid>
  </List>
);

//SpeakerShow
const ShowActions = () => (
  <TopToolbar>
    <EditButton />
    <DeleteButton />
  </TopToolbar>
);

export const SpeakerShow = () => (
  <Show actions={<ShowActions />} title="Profil intervenant">
    <SimpleShowLayout>
      <FunctionField
        render={(record: RaRecord) => {
          const links = record.externalLinks as Record<string, string> | null;
          const sessions = record.sessions || [];
          const now = new Date();

          return (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Profile Header */}
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  p: 3,
                  borderRadius: 2,
                  bgcolor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  alignItems: "flex-start",
                }}
              >
                <Avatar
                  src={record.profilePhoto}
                  alt={record.fullName}
                  sx={{ width: 80, height: 80, fontSize: "2rem", bgcolor: "#eff1ff" }}
                >
                  {record.fullName?.[0]}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" fontWeight={700}>{record.fullName}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 500 }}>
                    {record.bio}
                  </Typography>

                  {links && Object.keys(links).length > 0 && (
                    <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
                      {Object.entries(links).map(([label, url]) => {
                        const Icon = SOCIAL_ICONS[label] || LanguageIcon;
                        return (
                          <Chip
                            key={label}
                            icon={<Icon sx={{ fontSize: "14px !important" }} />}
                            label={label}
                            size="small"
                            component="a"
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            clickable
                            variant="outlined"
                            sx={{ color: "#5b6cf9", borderColor: "#c7d2fe" }}
                          />
                        );
                      })}
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Sessions */}
              <Box>
                <Typography variant="subtitle1" fontWeight={700} mb={2}>
                  Sessions ({sessions.length})
                </Typography>
                {sessions.length === 0 ? (
                  <Typography color="text.secondary" variant="body2">Aucune session assignée</Typography>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {sessions.map((ss: RaRecord) => {
                      const s = ss.session || ss;
                      const isLive =
                        new Date(s.startTime) <= now && new Date(s.endTime) >= now;
                      return (
                        <Box
                          key={s.id}
                          sx={{
                            p: 2,
                            borderRadius: 1.5,
                            border: "1px solid",
                            borderColor: isLive ? "#fecaca" : "#e2e8f0",
                            bgcolor: isLive ? "#fef2f2" : "#f8fafc",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              {isLive && (
                                <Chip label="LIVE" size="small" sx={{ bgcolor: "#ef4444", color: "white", fontWeight: 700, fontSize: "0.6rem" }} />
                              )}
                              <Typography variant="body2" fontWeight={600}>{s.title}</Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {s.event?.title} · {s.room?.name}
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(s.startTime).toLocaleString("fr-FR", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })}
                          </Typography>
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

//SpeakerCreate
export const SpeakerCreate = () => (
  <Create title="Nouvel intervenant" redirect="list">
    <SimpleForm>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 600 }}>
        <TextInput
          source="fullName"
          label="Nom complet"
          validate={required("Le nom est requis")}
          fullWidth
        />
        <TextInput
          source="profilePhoto"
          label="URL de la photo de profil"
          fullWidth
          helperText="URL d'une image (https://...)"
        />
        <TextInput
          source="bio"
          label="Biographie"
          validate={required("La bio est requise")}
          multiline
          rows={5}
          fullWidth
        />
        <ExternalLinksInput />
      </Box>
    </SimpleForm>
  </Create>
);

// SpeakerEdit
export const SpeakerEdit = () => (
  <Edit title="Modifier l'intervenant" redirect="list">
    <SimpleForm>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 600 }}>
        <TextInput
          source="fullName"
          label="Nom complet"
          validate={required("Le nom est requis")}
          fullWidth
        />
        <TextInput
          source="profilePhoto"
          label="URL de la photo de profil"
          fullWidth
          helperText="URL d'une image (https://...)"
        />
        <TextInput
          source="bio"
          label="Biographie"
          validate={required("La bio est requise")}
          multiline
          rows={5}
          fullWidth
        />
        <ExternalLinksInput />
      </Box>
    </SimpleForm>
  </Edit>
);
