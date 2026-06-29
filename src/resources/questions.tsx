import {
  List,
  Datagrid,
  DateField,
  Show,
  SimpleShowLayout,
  TopToolbar,
  ShowButton,
  DeleteButton,
  ExportButton,
  useRecordContext,
  FunctionField,
  WrapperField,
  BulkDeleteButton,
} from "react-admin";
import { Chip, Box, Typography, Avatar, LinearProgress } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import PersonIcon from "@mui/icons-material/Person";
import { RaRecord } from "react-admin";


// Author Cell
const AuthorCell = () => {
  const record = useRecordContext();
  if (!record) return null;
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Avatar sx={{ width: 24, height: 24, bgcolor: "#eff1ff", fontSize: "0.7rem" }}>
        <PersonIcon sx={{ fontSize: 14, color: "#5b6cf9" }} />
      </Avatar>
      <Typography variant="body2" color={record.authorName ? "text.primary" : "text.secondary"} fontStyle={record.authorName ? "normal" : "italic"}>
        {record.authorName || "Anonyme"}
      </Typography>
    </Box>
  );
};

// Content Truncated
const ContentTruncated = () => {
  const record = useRecordContext();
  if (!record) return null;
  const text = record.content || "";
  const truncated = text.length > 100 ? text.slice(0, 100) + "…" : text;
  return (
    <Typography variant="body2" sx={{ maxWidth: 320 }}>
      {truncated}
    </Typography>
  );
};

//Session Reference Cell
const SessionCell = () => {
  const record = useRecordContext();
  if (!record?.session && !record?.sessionId) return <Typography variant="caption" color="text.secondary">—</Typography>;
  return (
    <Chip
      label={record.session?.title || record.sessionId}
      size="small"
      variant="outlined"
      sx={{ maxWidth: 200, color: "#5b6cf9", borderColor: "#c7d2fe" }}
    />
  );
};

//List Toolbar
const ListActions = () => (
  <TopToolbar>
    <ExportButton label="Exporter" />
  </TopToolbar>
);

// QuestionList

export const QuestionList = () => (
  <List
    actions={<ListActions />}
    sort={{ field: "upvotes", order: "DESC" }}
    perPage={20}
    title="Questions"
    sx={{ "& .RaList-content": { borderRadius: 2, overflow: "hidden" } }}
  >
    <Datagrid
      bulkActionButtons={<BulkDeleteButton label="Supprimer la sélection" />}
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
      <FunctionField label="Question" render={() => <ContentTruncated />} />
      <FunctionField label="Auteur" render={() => <AuthorCell />} />
      <FunctionField label="Session" render={() => <SessionCell />} />
      <FunctionField
        label="Votes"
        render={(record: RaRecord) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <ThumbUpIcon sx={{ fontSize: 14, color: "#5b6cf9" }} />
            <Typography variant="body2" fontWeight={700} color="#5b6cf9">
              {record.upvotes}
            </Typography>
          </Box>
        )}
      />
      <DateField source="createdAt" label="Posée le" showTime locales="fr-FR" options={{ dateStyle: "short", timeStyle: "short" }} />
      <WrapperField label="Actions">
        <ShowButton />
        <DeleteButton />
      </WrapperField>
    </Datagrid>
  </List>
);

// QuestionShow
const ShowActions = () => (
  <TopToolbar>
    <DeleteButton />
  </TopToolbar>
);

export const QuestionShow = () => (
  <Show actions={<ShowActions />} title="Détail question">
    <SimpleShowLayout>
      <FunctionField
        render={(record: RaRecord) => (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Question Card */}
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: "#eff1ff" }}>
                    <PersonIcon sx={{ fontSize: 18, color: "#5b6cf9" }} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {record.authorName || <em style={{ color: "#9ca3af" }}>Anonyme</em>}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(record.createdAt).toLocaleString("fr-FR", {
                        dateStyle: "long",
                        timeStyle: "short",
                      })}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  icon={<ThumbUpIcon sx={{ fontSize: "14px !important" }} />}
                  label={`${record.upvotes} vote${record.upvotes !== 1 ? "s" : ""}`}
                  sx={{ bgcolor: "#eff1ff", color: "#5b6cf9", fontWeight: 700 }}
                />
              </Box>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                {record.content}
              </Typography>
            </Box>

            {/* Session Reference */}
            {(record.session || record.sessionId) && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>
                  Session associée
                </Typography>
                <Chip
                  label={record.session?.title || record.sessionId}
                  variant="outlined"
                  sx={{ color: "#5b6cf9", borderColor: "#c7d2fe" }}
                />
              </Box>
            )}
          </Box>
        )}
      />
    </SimpleShowLayout>
  </Show>
);
