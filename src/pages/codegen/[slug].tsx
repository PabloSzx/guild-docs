import { Heading } from "@chakra-ui/react";

import { MDXPage } from "../../mdx/client";
import { MDXPaths, MDXProps } from "../../mdx/server";

import type { GetStaticPaths, GetStaticProps } from "next";

export default MDXPage(function PostPage({ content, useTranslation }) {
  const { t } = useTranslation("common");

  return (
    <>
      <Heading>{t("greeting")}</Heading>
      <main>{content}</main>
    </>
  );
});

export const getStaticProps: GetStaticProps = (ctx) => {
  return MDXProps(({ getParam, readFile }) => {
    return readFile(`codegen-docs/getting-started/${getParam("slug")}.md`);
  }, ctx);
};

export const getStaticPaths: GetStaticPaths = (ctx) => {
  return MDXPaths("codegen-docs/getting-started", ctx);
};
