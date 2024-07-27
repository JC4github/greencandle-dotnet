describe('Save Report Test', () => {
    it('should save the report', () => {
        // login
        cy.visit('/Login');
        cy.get('input[type=email]').type('test@gmail.com');
        cy.get('input[type=password]').type('123456');
        cy.get('button[type=submit]').click();
        cy.wait(2000);

        // navigate to stock detail page
        cy.visit('/StockDetail/AAPL/');

        // generate report
        cy.get('button[name=generate-report-button]').click();

        // wait for the report to be generated
        cy.wait(10000);
        cy.url().should('include', '/StockDetail/AAPL/report');
        cy.contains('Due Diligence Report on AAPL');

        // save report
        cy.get('button[name=save-report-button]').click();
        cy.wait(2000);

        // click ok on info dialog
        cy.get('button[name=ok-button]').click();

        // navigate to saved report page
        cy.get('button[name=menu-button]').click();
        cy.get('button[name=saved-report-button]').click();
        cy.wait(2000);

        // check if the report is saved
        cy.contains('AAPL');

        // logout
        cy.visit('/');
        cy.get('button[name=menu-button]').click();
        cy.get('button[name=logout-button]').click();
    });
});