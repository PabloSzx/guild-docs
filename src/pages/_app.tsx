import "../../public/custom.css";
import "remark-admonitions/styles/classic.css";
import "remark-admonitions/styles/infima.css";
import "prism-themes/themes/prism-dracula.css";

import { appWithTranslation } from "next-i18next";
import { ReactNode, useMemo } from "react";

import { ChakraProvider, extendTheme, Stack } from "@chakra-ui/react";
import { NextNProgress } from "../components/NProgress";
import { CmpInternalProps, MDXNavigation } from "../mdx/client";
import { iterateRoutes } from "../mdx/routes";

import type { AppProps } from "next/app";

const theme = extendTheme({
  colors: {},
});

export function AppThemeProvider({ children }: { children: ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}

function App({ Component, pageProps }: AppProps) {
  const mdxRoutes: CmpInternalProps["mdxRoutes"] | undefined = pageProps.mdxRoutes;
  const Navigation = useMemo(() => {
    if (!mdxRoutes) return null;

    if (mdxRoutes === 1) {
      const mdxRoutesData = process.env.SERIALIZED_MDX_ROUTES;
      if (!mdxRoutesData) return null;

      return <MDXNavigation paths={iterateRoutes(JSON.parse(mdxRoutesData))} />;
    }

    return <MDXNavigation paths={iterateRoutes(mdxRoutes)} />;

    // Prevent not needed re-render after navigation
  }, [mdxRoutes]);
  return (
    <>
      <NextNProgress />
      <AppThemeProvider>
        <Stack isInline>
          {Navigation}
          <Component {...pageProps} />
        </Stack>
      </AppThemeProvider>
    </>
  );
}

export default appWithTranslation(App);
