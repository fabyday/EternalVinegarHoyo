import { config } from "node:process";

module.exports = {
    plugins: {
      "@tailwindcss/postcss": {
        config: "./tailwind.config.js",
      },
      autoprefixer: {},
    },
  };