import type { ReactNode } from "react";
import { Layout as RALayout, Menu } from "react-admin";
import { Box } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MicIcon from "@mui/icons-material/Mic";
import PeopleIcon from "@mui/icons-material/People";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import DashboardIcon from "@mui/icons-material/Dashboard";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const RESOURCE_ICONS: Record<string, React.ElementType> = {
  events: CalendarMonthIcon,
  sessions: MicIcon,
  speakers: PeopleIcon,
  rooms: MeetingRoomIcon,
  questions: QuestionAnswerIcon,
};

const RESOURCE_LABELS: Record<string, string> = {
  events: "Événements",
  sessions: "Sessions",
  speakers: "Intervenants",
  rooms: "Salles",
  questions: "Questions",
};

const CustomMenu = () => {
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  return (
    <Menu
      sx={{
        "& .RaMenu-root": { pt: 1 },
        "& .RaMenuItem-root": {
          borderRadius: 2,
          mx: 1,
          mb: 0.5,
          "&:hover": { bgcolor: "rgba(91,108,249,0.08)" },
          "&.RaMenuItem-active": {
            bgcolor: "rgba(91,108,249,0.12)",
            color: "#5b6cf9",
            "& .MuiListItemIcon-root": { color: "#5b6cf9" },
          },
        },
      }}
    >
      <Menu.DashboardItem
        leftIcon={<DashboardIcon />}
        primaryText="Dashboard"
      />
      {Object.entries(RESOURCE_LABELS).map(([resource, label]) => {
        const Icon = RESOURCE_ICONS[resource];
        return (
          <Menu.ResourceItem
            key={resource}
            name={resource}
            leftIcon={Icon ? <Icon /> : undefined}
            primaryText={label}
          />
        );
      })}

      {/* Link to public site */}
      <Box
        component="a"
        href={apiBase}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 2,
          py: 1.5,
          mx: 1,
          mt: 2,
          borderRadius: 2,
          cursor: "pointer",
          textDecoration: "none",
          color: "inherit",
          opacity: 0.6,
          fontSize: "0.875rem",
          border: "1px dashed rgba(0,0,0,0.15)",
          "&:hover": { opacity: 0.9, bgcolor: "rgba(0,0,0,0.04)" },
        }}
      >
        <OpenInNewIcon sx={{ fontSize: 18 }} />
        Voir le site public
      </Box>
    </Menu>
  );
};

export const Layout = ({ children }: { children: ReactNode }) => (
  <RALayout
    menu={CustomMenu}
    sx={{
      "& .RaLayout-appFrame": { marginTop: 0 },
      "& .RaSidebar-root": {
        "& .MuiDrawer-paper": {
          background: "#ffffff",
          borderRight: "1px solid #e2e8f0",
        },
      },
      "& .RaAppBar-root": {
        background: "linear-gradient(90deg, #ffffff 0%, #f8fafc 100%)",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        color: "#0f1117",
        "& .MuiToolbar-root": { minHeight: 56 },
      },
      "& .RaLayout-content": {
        bgcolor: "#f8fafc",
        minHeight: "100vh",
        paddingTop: "60px",
      },
    }}
  >
    {children}
  </RALayout>
);
