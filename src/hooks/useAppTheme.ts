import { useMemo } from 'react';
import { createTheme, useMediaQuery } from '@mui/material';

export const useAppTheme = (prefersDarkMode?: boolean | null) => {
  const systemPrefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const isDark = prefersDarkMode !== null && prefersDarkMode !== undefined ? prefersDarkMode : systemPrefersDark;

  return useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDark ? 'dark' : 'light',
          primary: {
            main: '#2196F3',
            light: '#64B5F6',
            dark: '#1976D2',
          },
          secondary: {
            main: '#F50057',
            light: '#F73378',
            dark: '#C51162',
          },
          success: {
            main: '#4CAF50',
          },
          error: {
            main: '#F44336',
          },
          warning: {
            main: '#FF9800',
          },
          background: {
            default: isDark ? '#121212' : '#FAFAFA',
            paper: isDark ? '#1E1E1E' : '#FFFFFF',
          },
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontSize: '2.5rem',
            fontWeight: 600,
            letterSpacing: '-0.5px',
          },
          h2: {
            fontSize: '2rem',
            fontWeight: 600,
          },
          h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
          },
          h4: {
            fontSize: '1.5rem',
            fontWeight: 600,
          },
          h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
          },
          h6: {
            fontSize: '1rem',
            fontWeight: 500,
          },
          body1: {
            fontSize: '1rem',
            lineHeight: 1.5,
          },
          body2: {
            fontSize: '0.875rem',
            lineHeight: 1.43,
          },
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 8,
              },
              sizeMedium: {
                padding: '10px 24px',
                fontSize: '1rem',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
              },
            },
          },
          MuiTextField: {
            defaultProps: {
              variant: 'outlined',
            },
          },
        },
      }),
    [isDark]
  );
};
