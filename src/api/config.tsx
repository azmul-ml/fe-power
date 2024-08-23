import packageJson from "../../package.json";

const env = import.meta.env;

/** Environment parameters */
export const ENV = Object.freeze({
  VERSION: packageJson.version,
  NODE_ENV: env.NODE_ENV,
  API_HOST: env.VITE_API_HOST,
});
