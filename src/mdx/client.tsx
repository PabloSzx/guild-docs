import { SSRConfig, useTranslation } from "next-i18next";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { createElement, ReactElement, ReactNode } from "react";

import { components } from "./shared";

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
}

export function MDXPage(cmp: (props: CmpProps) => ReactElement) {
  return function MDXPage({ children, source, frontMatter }: CmpInternalProps) {
    const content = <MDXRemote {...source} components={components} />;

    return createElement(cmp, {
      content,
      frontMatter,
      useTranslation,
      children,
    });
  };
}
