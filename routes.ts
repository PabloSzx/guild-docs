import { readFileSync } from "fs";
import globby from "globby";
import matter from "gray-matter";

export type IRoutes = {
  $routes?: [href: string, name: string][];
  $name?: string;
} & {
  [P: string]: IRoutes;
};

export function getSlug({ path, replaceBasePath }: { path: string; replaceBasePath?: string }) {
  let slugPath = path.replace(/\.mdx?$/, "");

  if (replaceBasePath) slugPath = slugPath.replace(replaceBasePath, "");

  const slug = slugPath.split("/").filter((v) => !!v);

  return slug;
}

export interface AddRoutesConfig {
  Routes?: IRoutes;
  folderPattern: string;
  basePath?: string;
  basePathLabel?: string;
  replaceBasePath?: string;
  labels?: Record<string, string | undefined>;
}

export function AddRoutes(config: AddRoutesConfig) {
  const {
    basePath,
    basePathLabel,
    folderPattern,
    Routes = {},
    replaceBasePath = config.folderPattern,
    labels = {},
  } = config;

  const baseRoutes: IRoutes = basePathLabel ? ({ $name: basePathLabel } as IRoutes) : {};

  for (const path of globby.sync(folderPattern)) {
    if (!/\.mdx?$/.test(path)) continue;

    const md = readFileSync(path);

    const { data } = matter(md);

    const slugList = getSlug({
      path,
      replaceBasePath,
    });

    let currentRoute = basePath ? (Routes[basePath] ||= baseRoutes) : Routes;

    let acumSlug = "";
    for (const [index, slug] of slugList.entries()) {
      acumSlug += slug;
      if (index === slugList.length - 1) {
        (currentRoute.$routes ||= []).push([slug, data.title || labels[acumSlug] || slug]);
      } else {
        currentRoute = currentRoute[slug] ||= {};

        labels[acumSlug] && (currentRoute.$name = labels[acumSlug]);
      }

      acumSlug += ".";
    }
  }

  return Routes;
}

export function getRoutes() {
  const Routes = AddRoutes({
    folderPattern: "codegen-docs",
    basePath: "codegen",
    basePathLabel: "Codegen",
    labels: {
      index: "Home",
      other: "Other",
      "custom-codegen": "Custom Codegen",
      "generated-config": "Generated Config",
      "getting-started": "Getting Started",
      integrations: "Integrations",
      migration: "Migration",
      plugins: "Plugins",
      presets: "Presets",
    },
  });

  AddRoutes({ Routes, folderPattern: "docs", basePath: "posts", basePathLabel: "Posts" });

  return Routes;
}
