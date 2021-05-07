import { Stack } from "@chakra-ui/react";

import { MDXPage } from "../../mdx/client";
import { MDXPaths, MDXProps } from "../../mdx/server";

import type { GetStaticPaths, GetStaticProps } from "next";

export default MDXPage(function PostPage({ content }) {
  return (
    <Stack>
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
