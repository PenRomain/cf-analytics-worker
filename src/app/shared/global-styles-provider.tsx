"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { memo, ReactNode } from "react";

const theme = createTheme();

export default memo<{ children: ReactNode }>(function GlobalStylesProvider({
  children,
}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
});
