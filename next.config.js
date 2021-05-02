const { i18n } = require("./next-i18next.config");

const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
});
module.exports = withMDX({
  pageExtensions: ["tsx", "mdx"],
  future: {
    webpack5: true,
  },
  i18n,
});
