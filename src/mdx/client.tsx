import { SSRConfig, useTranslation } from "next-i18next";
import hydrate from "next-mdx-remote/hydrate";
import { createElement, ReactElement, ReactNode } from "react";

import { components } from "./shared";

import type { MdxRemote } from "next-mdx-remote/types";

export interface CmpProps {
  content: ReactNode;
  frontMatter: Record<string, any>;
  useTranslation: typeof useTranslation;
}

export interface CmpInternalProps {
  children?: ReactNode;
  source: MdxRemote.Source;
  frontMatter: Record<string, any>;
  _nextI18Next: SSRConfig["_nextI18Next"];
}

export function MDXPage(cmp: (props: CmpProps) => ReactElement) {
  return function MDXPage({ children, source, frontMatter }: CmpInternalProps) {
    const content = hydrate(source, {
      components,
    });

    return createElement(cmp, {
      content,
      frontMatter,
      useTranslation,
      children,
    });
  };
}
