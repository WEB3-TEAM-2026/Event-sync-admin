import { useGetList } from "react-admin";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MicIcon from "@mui/icons-material/Mic";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EventIcon from "@mui/icons-material/Event";
import { RaRecord } from "react-admin";

//Stat Card
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  subtitle?: string;
  loading?: boolean;
}

const StatCard = ({ title, value, icon: Icon, color, bgColor, subtitle, loading }: StatCardProps) => (
  <Card
    elevation={0}
    sx={{
      border: "1px solid #e2e8f0",
      borderRadius: 3,
      transition: "all 0.2s",
      "&:hover": { boxShadow: "0 4px 20px rgba(0,0,0,0.08)", transform: "translateY(-2px)" },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {title}
          </Typography>
          {loading ? (
            <Skeleton width={60} height={40} />
          ) : (
            <Typography variant="h3" fontWeight={800} sx={{ lineHeight: 1.2, mt: 0.5 }}>
              {value}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: bgColor }}>
          <Icon sx={{ fontSize: 28, color }} />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

//Live Sessions Panel
const LiveSessionsPanel = ({ sessions }: { sessions: RaRecord[] }) => {
  const now = new Date();
  const liveSessions = sessions.filter(
    (s) => new Date(s.startTime) <= now && new Date(s.endTime) >= now
  );

  return (
    <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3, height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PlayCircleIcon sx={{ color: "#ef4444" }} />
            <Typography variant="subtitle1" fontWeight={700}>En direct</Typography>
          </Box>
          <Chip
            label={`${liveSessions.length} LIVE`}
            size="small"
            sx={{
              bgcolor: "#fef2f2",
              color: "#ef4444",
              border: "1px solid #fecaca",
              fontWeight: 700,
              animation: liveSessions.length > 0 ? "pulse 1.5s infinite" : "none",
              "@keyframes pulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.6 } },
            }}
          />
        </Box>

        {liveSessions.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <AccessTimeIcon sx={{ fontSize: 40, color: "#d1d5db", mb: 1 }} />
            <Typography color="text.secondary" variant="body2">
              Aucune session en cours
            </Typography>
          </Box>
        ) : (
          <List dense disablePadding>
            {liveSessions.map((s) => (
              <ListItem key={s.id} disablePadding sx={{ py: 1 }}>
                <ListItemAvatar sx={{ minWidth: 40 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 1.5,
                      bgcolor: "#fef2f2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PlayCircleIcon sx={{ fontSize: 16, color: "#ef4444" }} />
                  </Box>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {s.title}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {s.room?.name || "—"} · jusqu'à{" "}
                      {new Date(s.endTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

//Upcoming Sessions Panel
const UpcomingSessionsPanel = ({ sessions }: { sessions: RaRecord[] }) => {
  const now = new Date();
  const upcoming = sessions
    .filter((s) => new Date(s.startTime) > now)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 5);

  return (
    <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3, height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <AccessTimeIcon sx={{ color: "#5b6cf9" }} />
          <Typography variant="subtitle1" fontWeight={700}>Prochaines sessions</Typography>
        </Box>

        {upcoming.length === 0 ? (
          <Typography color="text.secondary" variant="body2" sx={{ py: 4, textAlign: "center" }}>
            Aucune session à venir
          </Typography>
        ) : (
          <List dense disablePadding>
            {upcoming.map((s, i) => {
              const start = new Date(s.startTime);
              const diffMs = start.getTime() - now.getTime();
              const diffH = Math.floor(diffMs / 3600000);
              const diffM = Math.floor((diffMs % 3600000) / 60000);
              const label =
                diffH > 24
                  ? `dans ${Math.floor(diffH / 24)}j`
                  : diffH > 0
                  ? `dans ${diffH}h${diffM > 0 ? diffM : ""}`
                  : `dans ${diffM}min`;

              return (
                <Box key={s.id}>
                  {i > 0 && <Divider sx={{ my: 1 }} />}
                  <ListItem disablePadding sx={{ py: 0.5 }}>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight={600} noWrap>
                          {s.title}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography variant="caption" color="text.secondary">
                            {s.room?.name || "—"}
                          </Typography>
                          <Chip
                            label={label}
                            size="small"
                            sx={{ bgcolor: "#eff1ff", color: "#5b6cf9", fontWeight: 600, height: 18, fontSize: "0.65rem" }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                </Box>
              );
            })}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

//Top Questions Panel
const TopQuestionsPanel = ({ sessions }: { sessions: RaRecord[] }) => {
  // Flatten all questions from all sessions
  const allQuestions: RaRecord[] = [];
  sessions.forEach((s) => {
    if (s.questions) {
      s.questions.forEach((q: RaRecord) => {
        allQuestions.push({ ...q, sessionTitle: s.title });
      });
    }
  });

  const top = allQuestions
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 5);

  return (
    <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <TrendingUpIcon sx={{ color: "#5b6cf9" }} />
          <Typography variant="subtitle1" fontWeight={700}>Questions les plus votées</Typography>
        </Box>

        {top.length === 0 ? (
          <Typography color="text.secondary" variant="body2" sx={{ py: 2, textAlign: "center" }}>
            Aucune question
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {top.map((q, i) => {
              const maxVotes = top[0]?.upvotes || 1;
              return (
                <Box key={q.id}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.5 }}>
                    <Box sx={{ display: "flex", gap: 1, flex: 1 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 800,
                          color: i === 0 ? "#f59e0b" : "#9ca3af",
                          minWidth: 16,
                        }}
                      >
                        #{i + 1}
                      </Typography>
                      <Typography variant="body2" sx={{ lineHeight: 1.4 }} noWrap>
                        {q.content}
                      </Typography>
                    </Box>
                    <Chip
                      label={`↑ ${q.upvotes}`}
                      size="small"
                      sx={{ bgcolor: "#eff1ff", color: "#5b6cf9", fontWeight: 700, ml: 1, height: 20, fontSize: "0.65rem" }}
                    />
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={Math.round((q.upvotes / maxVotes) * 100)}
                      sx={{
                        flex: 1,
                        height: 4,
                        borderRadius: 2,
                        bgcolor: "#e2e8f0",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: i === 0 ? "#f59e0b" : "#5b6cf9",
                          borderRadius: 2,
                        },
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ minWidth: 60 }}>
                      {q.sessionTitle}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Events Overview
const EventsOverview = ({ events }: { events: RaRecord[] }) => {
  const now = new Date();
  const active = events.filter(
    (e) => new Date(e.startDate) <= now && new Date(e.endDate) >= now
  );
  const upcoming = events.filter((e) => new Date(e.startDate) > now);
  const past = events.filter((e) => new Date(e.endDate) < now);

  return (
    <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <EventIcon sx={{ color: "#5b6cf9" }} />
          <Typography variant="subtitle1" fontWeight={700}>Vue d'ensemble des événements</Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          {[
            { label: "En cours", count: active.length, color: "#10b981", bg: "#ecfdf5" },
            { label: "À venir", count: upcoming.length, color: "#3b82f6", bg: "#eff6ff" },
            { label: "Terminés", count: past.length, color: "#6b7280", bg: "#f3f4f6" },
          ].map(({ label, count, color, bg }) => (
            <Box
              key={label}
              sx={{
                flex: 1,
                minWidth: 80,
                p: 2,
                borderRadius: 2,
                bgcolor: bg,
                textAlign: "center",
              }}
            >
              <Typography variant="h4" fontWeight={800} sx={{ color }}>
                {count}
              </Typography>
              <Typography variant="caption" sx={{ color, fontWeight: 600 }}>
                {label}
              </Typography>
            </Box>
          ))}
        </Box>

        {active.length > 0 && (
          <>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
              En cours maintenant
            </Typography>
            {active.map((e) => (
              <Box
                key={e.id}
                sx={{
                  mt: 1,
                  p: 2,
                  borderRadius: 1.5,
                  bgcolor: "#ecfdf5",
                  border: "1px solid #a7f3d0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="body2" fontWeight={600}>{e.title}</Typography>
                  <Typography variant="caption" color="text.secondary">{e.location}</Typography>
                </Box>
                <Chip
                  label={`${(e.sessions || []).length} sessions`}
                  size="small"
                  sx={{ bgcolor: "#10b981", color: "white", fontWeight: 600 }}
                />
              </Box>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
};

// Dashboard
export const Dashboard = () => {
  const { data: events = [], isLoading: eventsLoading } = useGetList("events", {
    pagination: { page: 1, perPage: 100 },
    sort: { field: "startDate", order: "ASC" },
  });

  const { data: sessions = [], isLoading: sessionsLoading } = useGetList("sessions", {
    pagination: { page: 1, perPage: 200 },
    sort: { field: "startTime", order: "ASC" },
  });

  const { data: speakers = [], isLoading: speakersLoading } = useGetList("speakers", {
    pagination: { page: 1, perPage: 100 },
    sort: { field: "fullName", order: "ASC" },
  });

  const { data: rooms = [], isLoading: roomsLoading } = useGetList("rooms", {
    pagination: { page: 1, perPage: 100 },
    sort: { field: "name", order: "ASC" },
  });

  const now = new Date();
  const liveSessions = sessions.filter(
    (s) => new Date(s.startTime) <= now && new Date(s.endTime) >= now
  );

  const allQuestions = sessions.reduce((acc, s) => acc + (s.questions?.length || 0), 0);

  return (
    <Box sx={{ p: 0 }}>
      {/* Page Title */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} sx={{ color: "#0f1117" }}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Vue d'ensemble de votre plateforme événementielle
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 3,
          mb: 4,
        }}
      >
        <StatCard
          title="Événements"
          value={events.length}
          icon={CalendarMonthIcon}
          color="#5b6cf9"
          bgColor="#eff1ff"
          loading={eventsLoading}
          subtitle={`${events.filter((e) => new Date(e.startDate) > now).length} à venir`}
        />
        <StatCard
          title="Sessions"
          value={sessions.length}
          icon={MicIcon}
          color="#10b981"
          bgColor="#ecfdf5"
          loading={sessionsLoading}
          subtitle={`${liveSessions.length} en direct`}
        />
        <StatCard
          title="Intervenants"
          value={speakers.length}
          icon={PeopleIcon}
          color="#8b5cf6"
          bgColor="#f5f3ff"
          loading={speakersLoading}
        />
        <StatCard
          title="Salles"
          value={rooms.length}
          icon={MeetingRoomIcon}
          color="#f59e0b"
          bgColor="#fef3c7"
          loading={roomsLoading}
        />
        <StatCard
          title="Questions"
          value={allQuestions}
          icon={QuestionAnswerIcon}
          color="#ef4444"
          bgColor="#fef2f2"
          loading={sessionsLoading}
          subtitle="au total"
        />
      </Box>

      {/* Main Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr" },
          gap: 3,
          mb: 3,
        }}
      >
        <LiveSessionsPanel sessions={sessions} />
        <UpcomingSessionsPanel sessions={sessions} />
        <EventsOverview events={events} />
      </Box>

      {/* Bottom Row */}
      <Box>
        <TopQuestionsPanel sessions={sessions} />
      </Box>
    </Box>
  );
};
