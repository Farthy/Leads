"use client";
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeSettings } from '@/utils/theme/Theme';
import { useSelector } from 'react-redux';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import '@/utils/i18n';

const MyApp = ({ children }) => {
  const theme = ThemeSettings();
  const customizer = useSelector((state) => state.customizer);

  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};

export default MyApp;
