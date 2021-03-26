/// <reference types="Cypress" />

describe('login works', () => {
    it('the user log in', () => {
      cy.visit('/login');
      cy.get('[data-test-cypress="username"]').type('test');
      cy.get('[data-test-cypress="password"]').type('testPassword');
  
      cy.get('[data-test-cypress="submit"]').click();

      console.log(Cypress.config());
  
      cy.url().should('eq', 'http://localhost:3000/', () => {
        expect(localStorage.getItem('whosthatpokemon_token').length).toBeGreaterThanOrEqual(1)
      });
    });
  });