import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { APIProvider } from '@vis.gl/react-google-maps';
import App from './App';
import reportWebVitals from './reportWebVitals';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B35',
      light: '#FF8C61',
      dark: '#E54B00',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#004E89',
      light: '#0077D6',
      dark: '#003A66',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFF0E5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string} libraries={['places']}>
        <App />
      </APIProvider>
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
