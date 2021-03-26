/// <reference types="Cypress" />
import { makeServer } from '../../src/server';

let server

beforeEach(() => {
    server = makeServer({ environment: 'test' });
})
afterEach(() => {
    server.shutdown()
})
beforeEach(() => {
    // @ts-ignore
    cy.login()
});

describe('Score table is showing', () => {
    it('redirects to protected route', () => {
        cy.visit('/');

        cy.get('[data-test-cypress="scores"]').click();

        cy.contains('Highscores')
    });
});