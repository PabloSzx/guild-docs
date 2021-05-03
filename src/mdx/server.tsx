import { readdir, readFile } from "fs/promises";
import matter from "gray-matter";
import { appWithTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import renderToString from "next-mdx-remote/render-to-string";
import { join, resolve } from "path";
import { Fragment } from "react";

import { components } from "./shared";

import type { GetStaticPathsContext, GetStaticPropsContext, GetStaticPropsResult } from "next";
import type { CmpInternalProps } from "./client";

const Provideri18n = appWithTranslation(({ children }) => <Fragment children={children} />);

async function prepareMDXRenderWithTranslations(locale: string | undefined) {
  const translations = await serverSideTranslations(locale!, ["common"]);

  return {
    provider: {
      component: Provideri18n,
      props: {
        pageProps: translations,
      },
    },
    translations,
  };
}

export async function MDXProps(
  getSource: (data: {
    params: Record<string, string | string[] | undefined>;
    readFile: typeof readFile;
    join: typeof join;
    resolve: typeof resolve;
    getParam: (name: string) => string;
  }) => Promise<string | Buffer>,
  { locale = "es", params = {} }: Pick<GetStaticPropsContext, "locale" | "params"> = {}
): Promise<GetStaticPropsResult<CmpInternalProps>> {
  const prepareMDX = prepareMDXRenderWithTranslations(locale);

  const source = await getSource({
    params,
    readFile,
    join,
    resolve,
    getParam(name) {
      const param = params[name];

      if (typeof param !== "string") throw Error(`No ${name} provided!`);

      return param;
    },
  });

  const { content, data } = matter(source);

  const {
    provider,
    translations: { _nextI18Next },
  } = await prepareMDX;

  const mdxSource = await renderToString(content, {
    components,
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
    },
    scope: data,
    provider,
  });

  return {
    props: {
      source: mdxSource,
      frontMatter: data,
      _nextI18Next,
    },
  };
}

async function getDocsPaths(dirRelativeToRoot: string) {
  const docsPath = join(process.cwd(), dirRelativeToRoot);

  const docsFilePaths = await readdir(docsPath);
  return docsFilePaths.filter((path) => /\.mdx?$/.test(path));
}

export async function MDXPaths(
  folderPath: string,
  { locales = ["en", "es"] }: Pick<GetStaticPathsContext, "locales"> = {}
) {
  const paths: {
    params: {
      slug: string;
    };
    locale: string;
  }[] = [];

  const docsSlugs = (await getDocsPaths(folderPath)).map((path) => path.replace(/\.mdx?$/, ""));

  for (const locale of locales) {
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
}
