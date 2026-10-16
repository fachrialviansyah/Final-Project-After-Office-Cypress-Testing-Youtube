require('dotenv').config();
const { defineConfig } = require('cypress');

if (!process.env.YOUTUBE_BASE_URL) {
  throw new Error('Missing required environment variable: YOUTUBE_BASE_URL. Copy .env.example to .env.');
}

module.exports = defineConfig({
  video: true,
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    reportPageTitle: 'YouTube Gaming Trending E2E',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
  },
  e2e: {
    defaultCommandTimeout: 15000,
    pageLoadTimeout: 60000,
    expose: {
      YOUTUBE_BASE_URL: process.env.YOUTUBE_BASE_URL,
    },
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      on('before:browser:launch', (browser, launchOptions) => {
        // A dark OS theme makes YouTube reload itself (?themeRefresh=1) mid-test; pin pages to light.
        if (browser.family === 'firefox') {
          launchOptions.preferences['layout.css.prefers-color-scheme.content-override'] = 1;
        }
        return launchOptions;
      });
      return config;
    },
  },
});
