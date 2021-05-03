import { MDXPage } from "../mdx/client";
import { MDXProps } from "../mdx/server";

import type { GetStaticProps } from "next";
export default MDXPage(({ content }) => {
  return (
    <>
      <main>{content}</main>
    </>
  );
});

export const getStaticProps: GetStaticProps = (ctx) => {
  return MDXProps(({ readFile }) => {
    return readFile("docs/index.mdx");
  }, ctx);
};
