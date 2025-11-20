import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppTheme, useAppInit } from './hooks';
import { useAppStore } from './stores/appStore';
import Dashboard from './features/dashboard/Dashboard';
import LoanDetail from './features/loans/LoanDetail';
import NewLoan from './features/loans/NewLoan';
import NotFound from './components/NotFound';

function App() {
  const darkMode = useAppStore((state) => state.darkMode);
  const { isLoading, error } = useAppInit();
  const theme = useAppTheme(darkMode);

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ p: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/loans/:loanId" element={<LoanDetail />} />
          <Route path="/loans/new" element={<NewLoan />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
