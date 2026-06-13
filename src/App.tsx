import { Admin, Resource } from "react-admin";
import { dataProvider } from "./providers/dataProvider";
import { authProvider } from "./providers/authProvider";
import { Layout } from "./Layout";
import { LoginPage } from "./components/LoginPage";
import { Dashboard } from "./components/Dashboard";

import { EventList, EventShow, EventCreate, EventEdit } from "./resources/events";
import { SessionList, SessionShow, SessionCreate, SessionEdit } from "./resources/sessions";
import { SpeakerList, SpeakerShow, SpeakerCreate, SpeakerEdit } from "./resources/speakers";
import { RoomList, RoomShow, RoomCreate, RoomEdit } from "./resources/rooms";
import { QuestionList, QuestionShow } from "./resources/questions";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MicIcon from "@mui/icons-material/Mic";
import PeopleIcon from "@mui/icons-material/People";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

export const App = () => (
  <Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
    layout={Layout}
    loginPage={LoginPage}
    dashboard={Dashboard}
    title="EventSync Admin"
    disableTelemetry
    theme={{
      palette: {
        primary: { main: "#5b6cf9", contrastText: "#ffffff" },
        secondary: { main: "#a78bfa", contrastText: "#ffffff" },
        background: { default: "#f8fafc", paper: "#ffffff" },
        error: { main: "#ef4444" },
        success: { main: "#10b981" },
        warning: { main: "#f59e0b" },
        text: {
          primary: "#0f1117",
          secondary: "#64748b",
        },
      },
      typography: {
        fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
        h4: { fontWeight: 800 },
        h5: { fontWeight: 700 },
        h6: { fontWeight: 700 },
      },
      shape: { borderRadius: 12 },
      components: {
        MuiCard: {
          styleOverrides: {
            root: { borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "none" },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
            },
            contained: {
              backgroundColor: "#5b6cf9",
              color: "#ffffff",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#4a5ae8",
                boxShadow: "0 2px 8px rgba(91,108,249,0.4)",
              },
            },
            outlined: {
              borderColor: "#5b6cf9",
              color: "#5b6cf9",
              "&:hover": {
                backgroundColor: "rgba(91,108,249,0.06)",
                borderColor: "#4a5ae8",
              },
            },
            text: {
              color: "#5b6cf9",
              "&:hover": {
                backgroundColor: "rgba(91,108,249,0.06)",
              },
            },
          },
        },
        MuiToolbar: {
          styleOverrides: {
            root: {
              backgroundColor: "#ffffff",
              gap: 8,
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: { borderRadius: 6 },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              "& .MuiOutlinedInput-root": { borderRadius: 8 },
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: { backgroundImage: "none" },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundColor: "#ffffff",
              color: "#0f1117",
              boxShadow: "0 1px 0 #e2e8f0",
            },
          },
        },
        MuiIconButton: {
          styleOverrides: {
            root: {
              color: "#5b6cf9",
            },
          },
        },
        MuiTableRow: {
          styleOverrides: {
            root: {
              "&:hover": { backgroundColor: "#f8fafc" },
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            head: {
              backgroundColor: "#f8fafc",
              color: "#64748b",
              fontWeight: 700,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            },
          },
        },
      },
    }}
  >
    <Resource
      name="events"
      list={EventList}
      show={EventShow}
      create={EventCreate}
      edit={EventEdit}
      icon={CalendarMonthIcon}
      options={{ label: "Événements" }}
      recordRepresentation="title"
    />
    <Resource
      name="sessions"
      list={SessionList}
      show={SessionShow}
      create={SessionCreate}
      edit={SessionEdit}
      icon={MicIcon}
      options={{ label: "Sessions" }}
      recordRepresentation="title"
    />
    <Resource
      name="speakers"
      list={SpeakerList}
      show={SpeakerShow}
      create={SpeakerCreate}
      edit={SpeakerEdit}
      icon={PeopleIcon}
      options={{ label: "Intervenants" }}
      recordRepresentation="fullName"
    />
    <Resource
      name="rooms"
      list={RoomList}
      show={RoomShow}
      create={RoomCreate}
      edit={RoomEdit}
      icon={MeetingRoomIcon}
      options={{ label: "Salles" }}
      recordRepresentation="name"
    />
    <Resource
      name="questions"
      list={QuestionList}
      show={QuestionShow}
      icon={QuestionAnswerIcon}
      options={{ label: "Questions" }}
      recordRepresentation="content"
    />
  </Admin>
);
