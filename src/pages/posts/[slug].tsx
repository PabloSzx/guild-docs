import { promises } from "fs";
import matter from "gray-matter";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";
import { join } from "path";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Heading, Stack } from "@chakra-ui/react";

import { components } from "../../components/markdownComponents";
import { getDocsFolder, getDocsPaths } from "../../utils/mdx";

import type { GetStaticPaths, GetStaticProps } from "next";
import type { MdxRemote } from "next-mdx-remote/types";
import { appWithTranslation, useTranslation } from "next-i18next";
interface PostProps {
  source: MdxRemote.Source;
  frontMatter: Record<string, any>;
}

type PostQueryParams = {
  slug: string;
};

export default function PostPage({ source }: PostProps) {
  const content = hydrate(source, {
    components,
    provider: {
      component: appWithTranslation,
      props: {},
    },
  });
  const { t } = useTranslation("common");

  return (
    <Stack>
      <Heading>{t("greeting")}</Heading>
      <main>{content}</main>
    </Stack>
  );
}

export const getStaticProps: GetStaticProps<PostProps, PostQueryParams> = async ({
  params,
  locale,
}) => {
  if (!params?.slug) throw Error("No slug provided!");

  const translations = serverSideTranslations(locale!, ["common"]);

  const source = (
    await promises.readFile(join(getDocsFolder("docs"), `${params.slug}.mdx`))
  ).toString("utf-8");

  const { content, data } = matter(source);

  const mdxSource = await renderToString(content, {
    components,
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
    },
    scope: data,
    provider: {
      component: appWithTranslation,
      props: {},
    },
  });

  return {
    props: {
      source: mdxSource,
      frontMatter: data,
      ...(await translations),
    },
  };
};

export const getStaticPaths: GetStaticPaths<PostQueryParams> = async ({ locales }) => {
  const paths: {
    params: {
      slug: string;
    };
    locale: string;
  }[] = [];

  const docsSlugs = (await getDocsPaths("docs")).map((path) => path.replace(/\.mdx?$/, ""));

  for (const locale of locales || []) {
    for (const slug of docsSlugs) {
      paths.push({
        params: {
          slug,
        },
        locale,
      });
    }
  }

  return {
    paths,
    fallback: false,
  };
};
