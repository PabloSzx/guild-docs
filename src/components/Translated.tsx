import { useTranslation } from "next-i18next";
import type { ReactNode } from "react";

export function Translated({ children, name }: { children?: ReactNode; name?: string }): ReactNode {
  const { t } = useTranslation("common");

  if (typeof name === "string") {
    return t(name);
  }
  if (typeof children === "string") {
    return t(children);
  }
  return children;
}
