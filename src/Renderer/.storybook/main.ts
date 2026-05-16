import type { StorybookConfig } from "@storybook/react-webpack5";

const config: StorybookConfig = {
  staticDirs: ["../../../resouces"],
  stories: ["../Stories/**/*.stories.@(js|jsx|ts|tsx|mdx)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-webpack5-compiler-swc", "@storybook/addon-docs"],
  framework: {
    name: "@storybook/react-webpack5",
    options: {
      builder: {
        useSWC: true,
      },
    },
  },
  webpackFinal: async (webpackConfig) => {
    webpackConfig.module ??= {};
    webpackConfig.module.rules = (webpackConfig.module.rules ?? []).filter((rule) => {
      if (!rule || typeof rule !== "object" || !("test" in rule)) {
        return true;
      }

      const test = rule.test;
      return !(test instanceof RegExp && test.test("index.css"));
    });

    webpackConfig.module.rules.push({
      test: /\.css$/,
      use: [
        "style-loader",
        {
          loader: "css-loader",
          options: {
            importLoaders: 1,
          },
        },
        {
          loader: "postcss-loader",
          options: {
            postcssOptions: {
              plugins: {
                "@tailwindcss/postcss": {},
                autoprefixer: {},
              },
            },
          },
        },
      ],
    });

    return webpackConfig;
  },
};

export default config;
