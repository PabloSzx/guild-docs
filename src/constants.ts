export const IS_SERVER = typeof window !== "undefined";
export const IS_BROWSER = !IS_SERVER;

export const IS_PRODUCTION = process.env.NODE_ENV === "production";
export const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
