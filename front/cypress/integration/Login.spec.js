/// <reference types="Cypress" />

describe('login works', () => {
    it('redirects to protected route', () => {
      cy.visit('/login');
      cy.get('[data-test-cypress="username"]').type('test');
      cy.get('[data-test-cypress="password"]').type('testPassword');
  
      cy.get('[data-test-cypress="submit"]').click();
  
      cy.url().should('eq', 'http://localhost:3000/');
    });
  });