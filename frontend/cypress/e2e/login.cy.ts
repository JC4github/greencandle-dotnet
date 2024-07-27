describe('Login Test', () => {
    it('should log in the user', () => {
        cy.visit('/Login');
        cy.get('input[type=email]').type('test@gmail.com');
        cy.get('input[type=password]').type('123456');
        cy.get('button[type=submit]').click();
        cy.url().should('include', '/');
        cy.contains('Generate Due Diligence Reports');
        cy.contains('test@gmail.com');
    });
});

describe('Logout Test', () => {
    it('should log out the user', () => {
        cy.visit('/');
        cy.get('button[name=menu-button]').click();
        cy.get('button[name=logout-button]').click();
        cy.url().should('include', '/');
        cy.contains('Login');
    });
});