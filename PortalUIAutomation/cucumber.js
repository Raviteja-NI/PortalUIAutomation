// cucumber.js
module.exports = {
  default: {
    format: ["allure-cucumberjs/reporter"],
    formatOptions: {
      resultsDir: "allure-results"
    },
    require: [
      "features/step_definitions/**/*.js", // Standard location
      "step_definitions/**/*.js",          // Root location
      "*.steps.js"                         // If files are in root (like payment.steps.js)
    ],

  }
}
