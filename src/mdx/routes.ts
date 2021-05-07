import type { IRoutes } from "../../routes";

export interface Paths {
  href: string;
  name?: string;
  isPage: boolean;
  paths?: Paths[];
}

export function iterateRoutes(routes: IRoutes, paths: Paths[] = []): Paths[] {
  const { $routes, $name, ...restRoutes } = routes;

  if ($routes) {
    for (const [href, name] of $routes) {
      paths.push({
        href,
        name,
        isPage: true,
      });
    }
  }

  for (const [href, { $name, ...entryRoutes }] of Object.entries(restRoutes)) {
    paths.push({
      href,
      name: $name,
      paths: iterateRoutes(entryRoutes),
      isPage:
        !!entryRoutes.$routes?.find((v) => v[0] === "index") ||
        Object.keys(entryRoutes).includes("index"),
    });
  }

  return paths;
}
