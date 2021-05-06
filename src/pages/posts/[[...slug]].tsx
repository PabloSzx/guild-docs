import { Heading, Stack } from "@chakra-ui/react";

import { MDXPage } from "../../mdx/client";
import { MDXPaths, MDXProps } from "../../mdx/server";

import type { GetStaticPaths, GetStaticProps } from "next";

export default MDXPage(function PostPage({ content, useTranslation }) {
  const { t } = useTranslation("common");

  return (
    <Stack>
      <Heading>{t("greeting")}</Heading>
      <main>{content}</main>
    </Stack>
  );
});

export const getStaticProps: GetStaticProps = (ctx) => {
  return MDXProps(({ readMarkdownFile, getArrayParam }) => {
    return readMarkdownFile("docs/", getArrayParam("slug"));
  }, ctx);
};

export const getStaticPaths: GetStaticPaths = (ctx) => {
  return MDXPaths("docs", { ctx });
};
