const { register } = require("esbuild-register/dist/node");

register({
  extensions: [".ts", ".tsx"],
});

const { i18n } = require("./next-i18next.config");

const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
});

const { getRoutes } = require("./routes.ts");

process.env.SERIALIZED_MDX_ROUTES = JSON.stringify(getRoutes());

module.exports = withMDX({
  pageExtensions: ["tsx", "mdx"],
  future: {
    webpack5: true,
  },
  i18n,
});
