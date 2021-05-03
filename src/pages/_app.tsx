import "../../public/custom.css";
import "remark-admonitions/styles/classic.css";
import "remark-admonitions/styles/infima.css";
import "prism-themes/themes/prism-dracula.css";
import { appWithTranslation } from "next-i18next";

import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";

import type { AppProps } from "next/app";
import type { ReactNode } from "react";

const theme = extendTheme({
  colors: {},
});

export function AppThemeProvider({ children }: { children: ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}

function App({ Component, pageProps }: AppProps) {
  return (
    <AppThemeProvider>
      <Component {...pageProps} />
    </AppThemeProvider>
  );
}

export default appWithTranslation(App);
