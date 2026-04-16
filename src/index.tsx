import React from "react";
import ReactDOM from "react-dom/client";
import { APIProvider } from "@vis.gl/react-google-maps";
import { CssBaseline, ThemeProvider } from "@mui/material";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import theme from "./theme";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const mapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const app = (
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {mapsApiKey ? (
        <APIProvider apiKey={mapsApiKey} libraries={["places"]}>
          <App mapsEnabled />
        </APIProvider>
      ) : (
        <App mapsEnabled={false} />
      )}
    </ThemeProvider>
  </React.StrictMode>
);

root.render(app);

reportWebVitals();
