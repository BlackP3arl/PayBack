import React, { useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';
import { lightTheme, darkTheme } from './src/constants/theme';

export default function App() {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

  useEffect(() => {
    setIsDarkMode(colorScheme === 'dark');
  }, [colorScheme]);

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <AppNavigator />
    </PaperProvider>
  );
}
