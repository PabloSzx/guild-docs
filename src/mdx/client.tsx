import { SSRConfig, useTranslation } from "next-i18next";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import Head from "next/head";
import Router from "next/router";
import { createElement, ReactElement, ReactNode } from "react";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/react";

import { components } from "./shared";

import type { Paths } from "./routes";
import type { IRoutes } from "../../routes";

export interface CmpProps {
  content: ReactNode;
  frontMatter: Record<string, any>;
  useTranslation: typeof useTranslation;
}

export interface CmpInternalProps {
  children?: ReactNode;
  source: MDXRemoteSerializeResult<Record<string, unknown>>;
  frontMatter: Record<string, any>;
  _nextI18Next: SSRConfig["_nextI18Next"];
  mdxRoutes: IRoutes | 1;
}

export function arePathnamesEqual(a: string, b: string) {
  if (a.endsWith("/") && b.endsWith("/")) return a === b;
  else if (a.endsWith("/")) return a.slice(0, a.length - 1) === b;
  else if (b.endsWith("/")) return b.slice(0, b.length - 1) === a;
  return a === b;
}

export function MDXNavigation({
  paths,
  acumHref = "",
  depth = 0,
}: {
  paths: Paths[];
  acumHref?: string;
  depth?: number;
}) {
  return (
    <Accordion
      allowMultiple
      allowToggle
      defaultIndex={depth < 1 ? Array.from(paths.keys()) : undefined}
      width={depth === 0 ? "280px" : undefined}
      minWidth={depth === 0 ? "280px" : undefined}
    >
      {paths.map(({ href, name, paths, isPage }, index) => {
        const finalHref = acumHref + "/" + (href === "index" ? "" : href);

        const isAnchor = isPage && !paths?.length;

        return (
          <AccordionItem key={index}>
            <AccordionButton
              as={isAnchor ? "a" : undefined}
              href={isAnchor ? finalHref : undefined}
              onClick={
                isAnchor
                  ? (ev) => {
                      ev.preventDefault();

                      if (!arePathnamesEqual(Router.asPath, finalHref)) {
                        Router.push(finalHref, undefined, {
                          scroll: true,
                        });
                      }
                    }
                  : undefined
              }
              onMouseOver={
                isAnchor
                  ? () => {
                      if (!arePathnamesEqual(Router.asPath, finalHref)) {
                        Router.prefetch(finalHref);
                      }
                    }
                  : undefined
              }
            >
              {isAnchor ? <span children={name || href} /> : <p>{name || href}</p>}
              {paths?.length ? <AccordionIcon /> : null}
            </AccordionButton>

            {paths?.length ? (
              <AccordionPanel>
                <MDXNavigation paths={paths} key={index} acumHref={finalHref} depth={depth + 1} />
              </AccordionPanel>
            ) : null}
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

export function MDXPage(cmp: (props: CmpProps) => ReactElement) {
  return function MDXPage({ children, source, frontMatter }: CmpInternalProps) {
    const title = frontMatter.title;

    const content = (
      <>
        {title ? (
          <Head>
            <title>{title}</title>
          </Head>
        ) : null}
        <nav></nav>
        <MDXRemote {...source} components={components} />
      </>
    );

    return createElement(cmp, {
      content,
      frontMatter,
      useTranslation,
      children,
    });
  };
}
