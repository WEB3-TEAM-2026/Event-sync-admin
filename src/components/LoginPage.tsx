import { useState } from "react";
import { useLogin, useNotify } from "react-admin";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  Divider,
  Alert,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ZapIcon from "@mui/icons-material/Bolt";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// Styles communs champ texte
const darkFieldSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "rgba(255,255,255,0.05)",
    color: "white",
    borderRadius: 2,
    "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
    "&:hover fieldset": { borderColor: "rgba(91,108,249,0.5)" },
    "&.Mui-focused fieldset": { borderColor: "#5b6cf9" },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255,255,255,0.4)",
    "&.Mui-focused": { color: "#5b6cf9" },
  },
  "& .MuiInputBase-input::placeholder": { color: "rgba(255,255,255,0.2)" },
};

// Formulaire de connexion
const LoginForm = ({ onSwitch }: { onSwitch: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const login = useLogin();
  const notify = useNotify();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ username: email, password });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Email ou mot de passe invalide.";
      notify(message, { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
        autoComplete="email"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon sx={{ color: "rgba(255,255,255,0.3)", fontSize: 18 }} />
            </InputAdornment>
          ),
        }}
        sx={darkFieldSx}
      />

      <TextField
        label="Mot de passe"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
        autoComplete="current-password"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon sx={{ color: "rgba(255,255,255,0.3)", fontSize: 18 }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                sx={{ color: "rgba(255,255,255,0.3)" }}
              >
                {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={darkFieldSx}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
        sx={{
          mt: 1,
          py: 1.5,
          borderRadius: 2,
          background: "linear-gradient(135deg, #5b6cf9 0%, #7c3aed 100%)",
          fontWeight: 700,
          fontSize: "0.95rem",
          textTransform: "none",
          boxShadow: "0 4px 16px rgba(91,108,249,0.4)",
          "&:hover": {
            background: "linear-gradient(135deg, #4a5ae8 0%, #6d28d9 100%)",
          },
          "&.Mui-disabled": { opacity: 0.6 },
        }}
      >
        {loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Se connecter"}
      </Button>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", my: 0.5 }} />

      <Button
        variant="outlined"
        fullWidth
        onClick={onSwitch}
        sx={{
          py: 1.2,
          borderRadius: 2,
          borderColor: "rgba(255,255,255,0.15)",
          color: "rgba(255,255,255,0.6)",
          textTransform: "none",
          fontWeight: 500,
          "&:hover": {
            borderColor: "rgba(91,108,249,0.5)",
            color: "rgba(255,255,255,0.9)",
            bgcolor: "rgba(91,108,249,0.08)",
          },
        }}
      >
        Créer un compte organisateur
      </Button>
    </Box>
  );
};

// Formulaire d'inscription
const SignupForm = ({ onSwitch }: { onSwitch: () => void }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Impossible de créer le compte.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Erreur réseau. Vérifiez que le serveur Next.js tourne.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Alert
          severity="success"
          sx={{
            bgcolor: "rgba(16,185,129,0.12)",
            color: "#10b981",
            border: "1px solid rgba(16,185,129,0.3)",
            borderRadius: 2,
            "& .MuiAlert-icon": { color: "#10b981" },
          }}
        >
          Compte créé avec succès ! Vous pouvez maintenant vous connecter.
        </Alert>
        <Button
          variant="contained"
          fullWidth
          onClick={onSwitch}
          sx={{
            py: 1.5,
            borderRadius: 2,
            background: "linear-gradient(135deg, #5b6cf9 0%, #7c3aed 100%)",
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          Se connecter
        </Button>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      {error && (
        <Alert
          severity="error"
          sx={{
            bgcolor: "rgba(239,68,68,0.1)",
            color: "#f87171",
            border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: 2,
            "& .MuiAlert-icon": { color: "#f87171" },
          }}
        >
          {error}
        </Alert>
      )}

      <TextField
        label="Nom complet"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        fullWidth
        autoComplete="name"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon sx={{ color: "rgba(255,255,255,0.3)", fontSize: 18 }} />
            </InputAdornment>
          ),
        }}
        sx={darkFieldSx}
      />

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
        autoComplete="email"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon sx={{ color: "rgba(255,255,255,0.3)", fontSize: 18 }} />
            </InputAdornment>
          ),
        }}
        sx={darkFieldSx}
      />

      <TextField
        label="Mot de passe (8 caractères min.)"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
        inputProps={{ minLength: 8 }}
        autoComplete="new-password"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon sx={{ color: "rgba(255,255,255,0.3)", fontSize: 18 }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                sx={{ color: "rgba(255,255,255,0.3)" }}
              >
                {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={darkFieldSx}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
        sx={{
          mt: 1,
          py: 1.5,
          borderRadius: 2,
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          fontWeight: 700,
          fontSize: "0.95rem",
          textTransform: "none",
          boxShadow: "0 4px 16px rgba(16,185,129,0.3)",
          "&:hover": { background: "linear-gradient(135deg, #059669 0%, #047857 100%)" },
          "&.Mui-disabled": { opacity: 0.6 },
        }}
      >
        {loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Créer mon compte"}
      </Button>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", my: 0.5 }} />

      <Button
        variant="text"
        fullWidth
        onClick={onSwitch}
        sx={{
          color: "rgba(255,255,255,0.4)",
          textTransform: "none",
          "&:hover": { color: "rgba(255,255,255,0.7)", bgcolor: "transparent" },
        }}
      >
        ← Retour à la connexion
      </Button>
    </Box>
  );
};

// Page principale
export const LoginPage = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f1117 0%, #1a1e2a 50%, #0f1117 100%)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: "-30%",
          left: "-10%",
          width: "60%",
          height: "70%",
          background: "radial-gradient(circle, rgba(91,108,249,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: "-20%",
          right: "-10%",
          width: "50%",
          height: "60%",
          background: "radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        },
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 420,
          mx: 2,
          borderRadius: 4,
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(19,22,31,0.95)",
          backdropFilter: "blur(20px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Logo */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 56,
                height: 56,
                borderRadius: 3,
                background: "linear-gradient(135deg, #5b6cf9 0%, #a78bfa 100%)",
                mb: 2,
                boxShadow: "0 8px 24px rgba(91,108,249,0.4)",
              }}
            >
              <ZapIcon sx={{ color: "white", fontSize: 28 }} />
            </Box>
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{
                background: "linear-gradient(135deg, #5b6cf9 0%, #a78bfa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              EventSync Admin
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.4)", mt: 0.5 }}>
              {mode === "login" ? "Connectez-vous à votre espace" : "Créer un compte organisateur"}
            </Typography>
          </Box>

          {mode === "login" ? (
            <LoginForm onSwitch={() => setMode("signup")} />
          ) : (
            <SignupForm onSwitch={() => setMode("login")} />
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
