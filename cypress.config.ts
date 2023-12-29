import { defineConfig } from "cypress";
import webpackPreprocessorFunction from "@cypress/webpack-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";

export default defineConfig({
  env: {
    CURRENT_TESTING_ENV: "SPRINT5",
    TESTING_ENVS: {
      SPRINT5: {
        UI_HOST: "https://practicesoftwaretesting.com/#",
        API_HOST: "https://api.practicesoftwaretesting.com",
      },
      SPRINT5_BUGS: {
        UI_HOST: "https://with-bugs.practicesoftwaretesting.com",
        API_HOST: "https://api-with-bugs.practicesoftwaretesting.com",
      },
    },
  },
  e2e: {
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);

      on(
        "file:preprocessor",
        webpackPreprocessorFunction({
          webpackOptions: {
            resolve: {
              extensions: [".ts", ".js"],
            },
            module: {
              rules: [
                {
                  test: /\.ts$/,
                  exclude: [/node_modules/],
                  use: [
                    {
                      loader: "ts-loader",
                    },
                  ],
                },
                {
                  test: /\.feature$/,
                  use: [
                    {
                      loader: "@badeball/cypress-cucumber-preprocessor/webpack",
                      options: config,
                    },
                  ],
                },
              ],
            },
          },
        })
      );

      // Make sure to return the config object as it might have been modified by the plugin.
      return config;
    },
    specPattern: [
      "cypress/test/**/*.feature",
      "cypress/test/**/*.spec.{ts,js}",
      "cypress/testApi/**/*.apiSpec.{ts,js}",
    ],
    excludeSpecPattern: ["dummy/glob/pattern"],
  },
  watchForFileChanges: false,
  video: false,
  // viewportWidth: 400,
  // viewportHeight: 629,
});
