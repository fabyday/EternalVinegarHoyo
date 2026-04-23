import type { StorybookConfig } from "@storybook/react-webpack5";
//https://storybook.js.org/addons/@storybook/addon-postcss
import postcss from "postcss";
import path from 'path';
import { fileURLToPath } from 'url';



const config: StorybookConfig = {
  staticDirs: ["../../../resouces"],
  stories: [
    "../**/*.stories.@(js|jsx|ts|tsx|mdx)",
  ],

  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-webpack5-compiler-swc",
    "@storybook/addon-docs",
    {
      name: "@storybook/addon-postcss",
      options: {
        postcssLoaderOptions: {
          implementation: postcss,
          postcssOptions: {
            config: path.resolve(__dirname, '../postcss.config.js'),
          },
        },
      },
    },
    // {
    //   name: '@storybook/addon-styling-webpack',

    // }
  ],

  framework: {
    name: "@storybook/react-webpack5",
    options: {
      builder: {
        useSWC: true,
      },
    },
  },
};


// const config: StorybookConfig = {
//   // staticDirs : ["../images"],
//   stories: ["../**/*.mdx", "../**/*.stories.@(js|jsx|mjs|ts|tsx)"],


//   addons: ["@storybook/addon-webpack5-compiler-swc", 
//     "@storybook/addon-essentials",
//     //   {
//     //   /**
//     //    * Fix Storybook issue with PostCSS@8
//     //    * @see https://github.com/storybookjs/storybook/issues/12668#issuecomment-773958085
//     //    */
//     //   name: "@storybook/addon-postcss",
//     //   options: {
//     //     postcssLoaderOptions: {
//     //       implementation: postcss,
//     //     },
//     //   },
//     // },
//     "@storybook/addon-styling-webpack", "@storybook/react-webpack5"],
//   framework: {
//     name: "@storybook/react-webpack5",
//     options: {
//       builder: {
//         useSWC: true,
//       }
//     },
//   },
// };
export default config;