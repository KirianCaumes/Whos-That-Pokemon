// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


/*require('@cypress/react/support');

Cypress.on('window:before:load', (win) => {
  win.handleFromCypress = function (request) {
    return fetch(request.url, {
      method: request.method,
      headers: request.requestHeaders,
      body: request.requestBody
    }).then((res) => {
      let content = res.headers.get('content-type').includes('application/json')
        ? res.json()
        : res.text();
      return new Promise((resolve) => {
        content.then((body) => resolve([res.status, res.headers, body]));
      });
    });
  };
});

Cypress.Commands.add('login', () => {
  cy.window().its('localStorage').invoke('setItem', '_auth_t', 'hello');

  cy.window().its('localStorage').invoke('setItem', '_auth_t_type', 'hello');
  cy.window().its('localStorage').invoke('setItem', '_my_app_session', 'hello');

  var expTime = new Date(new Date().getTime() + 3600 * 60 * 1000);
  cy.window().its('localStorage').invoke('setItem', '_auth_time', expTime);
  cy.window()
    .its('localStorage')
    .invoke('setItem', '_auth_state', '{"token":"asd","expiresIn":"3600"}');
});*/

Cypress.Commands.add('login', () => {
    cy.visit('/login');
    cy.get('[data-test-cypress="username"]').type('test');
    cy.get('[data-test-cypress="password"]').type('testPassword');

    cy.get('[data-test-cypress="submit"]').click();
});