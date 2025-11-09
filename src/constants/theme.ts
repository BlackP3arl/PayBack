import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200EE',
    secondary: '#03DAC6',
    error: '#B00020',
    success: '#4CAF50',
    warning: '#FF9800',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    onSurface: '#000000',
    text: '#000000',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#BB86FC',
    secondary: '#03DAC6',
    error: '#CF6679',
    success: '#81C784',
    warning: '#FFB74D',
    background: '#121212',
    surface: '#121212',
    onSurface: '#FFFFFF',
    text: '#FFFFFF',
  },
};
