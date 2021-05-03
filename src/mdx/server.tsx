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
      remarkPlugins: [
        [
          require("remark-admonitions"),
          {
            customTypes: {
              shell: {
                keyword: "shell",
                svg:
                  '<svg xmlns="http://www.w3.org/2000/svg" width="16pt" height="16pt" viewBox="0 0 16 16"><path d="M0 0v16h16V0zm15.063 15.063H.937v-11h14.126zm0-11.938H.937V.937h14.126zm0 0"/><path d="M1.875 1.563h.938V2.5h-.938zm0 0M3.438 1.563h.937V2.5h-.938zm0 0M5 1.563h.938V2.5H5zm0 0M1.875 5.074v1.348l.988.637-.988.578V9.05l2.828-1.668v-.586zm0 0M5.34 7.559h1.027v1.226H5.34zm0 0M5.34 5.32h1.027v1.23H5.34zm0 0M6.8 8.785h2.356v1.137H6.801zm0 0"/></svg>',
              },
            },
          },
        ],
        require("remark-prism"),
      ],
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
