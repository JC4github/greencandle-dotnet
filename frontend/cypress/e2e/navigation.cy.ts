describe('Navigation Test', () => {
    it('should navigate to the Home page', () => {
        cy.visit('/Login');
        cy.get('._link_1gjox_15').click();
        cy.url().should('include', '/');
    });
});

describe('Navigation Test', () => {
    it('should navigate to Apple stock details page', () => {
        cy.visit('/StockDetail/AAPL');
        cy.url().should('include', '/StockDetail/AAPL');
        cy.contains('AAPL');
    });
});

describe('Navigation Test', () => {
    it('should navigate to the SavedReport page', () => {
        cy.visit('/Login');
        cy.get('input[type=email]').type('test@gmail.com');
        cy.get('input[type=password]').type('123456');
        cy.get('button[type=submit]').click();
        cy.get('button[name=menu-button]').click();
        cy.get('button[name=saved-report-button]').click();
        cy.url().should('include', '/SavedReport');
        cy.visit('/');
        cy.get('button[name=menu-button]').click();
        cy.get('button[name=logout-button]').click();
    });
});

describe('Navigation Test', () => {
    it('should navigate to Apple stock report page', () => {
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

        // logout
        cy.visit('/');
        cy.get('button[name=menu-button]').click();
        cy.get('button[name=logout-button]').click();
    });
});