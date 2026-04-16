import { alpha, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    background: {
      default: "#f4efe6",
      paper: "#fffaf5",
    },
    primary: {
      main: "#ef6c2f",
      dark: "#c3511a",
      light: "#ff9d69",
      contrastText: "#fff8f2",
    },
    secondary: {
      main: "#0d6778",
      dark: "#084b58",
      light: "#5ea8b2",
      contrastText: "#f5fffe",
    },
    success: {
      main: "#26885c",
    },
    text: {
      primary: "#17324a",
      secondary: "#526271",
    },
  },
  shape: {
    borderRadius: 22,
  },
  typography: {
    fontFamily: '"Space Grotesk", "Avenir Next", "Segoe UI", sans-serif',
    h1: {
      fontFamily: '"Fraunces", Georgia, serif',
      fontSize: "clamp(2.8rem, 7vw, 5.25rem)",
      fontWeight: 600,
      letterSpacing: "-0.05em",
      lineHeight: 0.96,
    },
    h2: {
      fontFamily: '"Fraunces", Georgia, serif',
      fontSize: "clamp(2.05rem, 4.2vw, 3.3rem)",
      fontWeight: 600,
      letterSpacing: "-0.04em",
      lineHeight: 1,
    },
    h3: {
      fontFamily: '"Fraunces", Georgia, serif',
      fontSize: "clamp(1.55rem, 3vw, 2.25rem)",
      fontWeight: 600,
      letterSpacing: "-0.03em",
      lineHeight: 1.08,
    },
    h4: {
      fontSize: "1.15rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
      lineHeight: 1.2,
    },
    h5: {
      fontSize: "1rem",
      fontWeight: 700,
      letterSpacing: "-0.01em",
      lineHeight: 1.35,
    },
    overline: {
      color: "#0d6778",
      fontWeight: 700,
      letterSpacing: "0.16em",
    },
    button: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
      textTransform: "none",
    },
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 18,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          minHeight: 46,
          paddingInline: "1.15rem",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600,
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        ":root": {
          colorScheme: "light",
        },
        "*": {
          boxSizing: "border-box",
        },
        "::selection": {
          backgroundColor: "#ffd5bf",
          color: "#17324a",
        },
        body: {
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top left, rgba(239,108,47,0.18), transparent 30%), radial-gradient(circle at top right, rgba(13,103,120,0.14), transparent 30%), linear-gradient(180deg, #faf4eb 0%, #f4efe6 50%, #efe7dc 100%)",
        },
        ".glass-panel": {
          backdropFilter: "blur(18px)",
        },
        ".skip-link": {
          position: "absolute",
          left: 16,
          top: -48,
          zIndex: 30,
          padding: "10px 14px",
          borderRadius: 999,
          backgroundColor: "#17324a",
          color: "#fffaf5",
          textDecoration: "none",
          transition: "top 160ms ease",
        },
        ".skip-link:focus": {
          top: 16,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: `1px solid ${alpha("#ffffff", 0.68)}`,
          boxShadow: "0 24px 70px rgba(23, 50, 74, 0.10)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 18,
            backgroundColor: alpha("#ffffff", 0.72),
          },
        },
      },
    },
  },
});

export default theme;
