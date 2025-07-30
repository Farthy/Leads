"use client";
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from '@mui/material/CssBaseline';
import RTL from '@/app/(DashboardLayout)/layout/shared/customizer/RTL';
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
        {/* ✅ Only apply RTL wrapper if Redux says rtl */}
        {customizer.activeDir === 'rtl' ? (
          <RTL direction="rtl">
            <CssBaseline />
            {children}
          </RTL>
        ) : (
          <>
            <CssBaseline />
            {children}
          </>
        )}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};

export default MyApp;
