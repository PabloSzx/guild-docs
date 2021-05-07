import "../../public/custom.css";
import "remark-admonitions/styles/classic.css";
import "remark-admonitions/styles/infima.css";
import "prism-themes/themes/prism-dracula.css";

import { appWithTranslation } from "next-i18next";
import NextNprogress from "nextjs-progressbar";
import { ReactNode, useMemo } from "react";

import { ChakraProvider, extendTheme, Stack } from "@chakra-ui/react";

import { MDXNavigation } from "../mdx/client";
import { iterateRoutes } from "../mdx/routes";

import type { AppProps } from "next/app";
import type { IRoutes } from "../../routes";

const theme = extendTheme({
  colors: {},
});

export function AppThemeProvider({ children }: { children: ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}

function App({ Component, pageProps }: AppProps) {
  const mdxRoutes: IRoutes | undefined = pageProps.mdxRoutes;
  const Navigation = useMemo(() => {
    if (mdxRoutes) return <MDXNavigation paths={iterateRoutes(mdxRoutes)} />;
    return null;
    // Prevent not needed navigation re-render after navigation
  }, [JSON.stringify(mdxRoutes)]);
  return (
    <AppThemeProvider>
      <NextNprogress color="#1D487F" height={5} options={{ showSpinner: true }} />
      <Stack isInline>
        {Navigation}
        <Component {...pageProps} />
      </Stack>
    </AppThemeProvider>
  );
}

export default appWithTranslation(App);
