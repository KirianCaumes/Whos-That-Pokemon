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

describe('Game start and is playable', () => {
    it('try to play the game', () => {

        cy.get('[data-test-cypress="play"]').click();
        cy.get('[data-test-cypress="pkmn-name"]').type('test');
        cy.get('[data-test-cypress="check"]').click();
        cy.get('[data-test-cypress="pkmn-name"]').clear();
        cy.get('[data-test-cypress="pkmn-name"]').type('Pikachu');
        cy.get('[data-test-cypress="check"]').click();
        cy.get('[data-test-cypress="stop"]').click();

        cy.contains('Game Over').should('be.visible')

        cy.get('[data-test-cypress="save"]').click();
    });
});