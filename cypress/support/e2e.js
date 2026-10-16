import 'cypress-mochawesome-reporter/register';

// YouTube page scripts throw errors unrelated to the scenario under test.
Cypress.on('uncaught:exception', () => false);
