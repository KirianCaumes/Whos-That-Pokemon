/// <reference types="jest" />

beforeEach(() => {
    // @ts-ignore
    cy.login()
})

describe('Score table is showing', () => {
    it('redirects to protected route', () => {

        cy.get('[data-test-cypress="scores"]').click();

        cy.contains('Highscores')

        cy.get('[data-test-cypress="scores-array"]').find('tr').its('length').should('be.gte', 1)
    });
});