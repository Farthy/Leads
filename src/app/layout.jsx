
import React from "react";
import { Providers } from "@/store/providers";
import MyApp from './app';
import "./global.css";
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Kejapay CRM',
  description: 'Kejapay CRM',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Toaster
          toastOptions={{
            style: {
              background: 'rgb(51 65 85)',
              color: '#fff',
            },
          }}
        />
        <Providers>
          <MyApp>{children}</MyApp>
        </Providers>
      </body>
    </html>
  );
}


