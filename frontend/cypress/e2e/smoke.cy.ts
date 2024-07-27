describe('Smoke Test', () => {
    it('should load the application', () => {
        cy.visit('/');
        cy.contains('Generate Due Diligence Reports'); 
    });
});