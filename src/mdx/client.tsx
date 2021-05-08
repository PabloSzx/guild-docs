import { SSRConfig, useTranslation } from "next-i18next";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import Head from "next/head";
import Router from "next/router";
import { createElement, ReactElement, ReactNode } from "react";

import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Collapse, Stack, useDisclosure } from "@chakra-ui/react";

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

function NavigationItem({
  item: { href, name, paths, isPage },
  acumHref,
  depth,
}: {
  item: Paths;
  acumHref: string;
  depth: number;
}) {
  const finalHref = acumHref + "/" + (href === "index" ? "" : href);

  const isAnchor = isPage && !paths?.length;

  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: depth < 1,
  });

  return (
    <>
      <Button
        justifyContent="flex-start"
        variant="ghost"
        width="100%"
        as={isAnchor ? "a" : undefined}
        href={isAnchor ? finalHref : undefined}
        whiteSpace="normal"
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
            : () => {
                onToggle();
              }
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
        alignItems="center"
        paddingX={`${depth + 1}em`}
      >
        <span>{name || href}</span>
        {paths?.length ? (
          <ChevronDownIcon
            className="chevdown"
            transition="transform 0.3s"
            transform={isOpen ? "rotate(180deg)" : undefined}
          />
        ) : null}
      </Button>

      {paths?.length ? (
        <Collapse in={isOpen} unmountOnExit>
          <MDXNavigation paths={paths} acumHref={finalHref} depth={depth + 1} />
        </Collapse>
      ) : null}
    </>
  );
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
  const Component = paths.map((item, index) => {
    return <NavigationItem key={index} item={item} acumHref={acumHref} depth={depth} />;
  });

  if (depth === 0) {
    return <Stack width="280px">{Component}</Stack>;
  }
  return <Stack>{Component}</Stack>;
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
