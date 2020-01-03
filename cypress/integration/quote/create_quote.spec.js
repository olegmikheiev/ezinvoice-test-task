import {loginAs} from '../../support/common/actions';

describe('Quotes management', function() {
    it('Quote with new person and new product can be created', function() {
        const clientData = {
            firstName: `John ${new Date().valueOf()}`,
            lastName: `Doe`
        };
        const productData = {
            itemCode: `item-code-${new Date().getMilliseconds()}`,
            description: `This is a product description`,
            taxRate: `TVA 8%`,
            unitCost: (new Date().getMilliseconds() / 10).toString()
        };
        loginAs('mytest@ezlux.lu', '123456');
        navigateToQuotes();
        navigateToNewQuote();
        createNewClient(clientData);
        selectClient(clientData.firstName);
        addNewProduct(0, productData);
        saveQuoteAsDraft();
        verifyQuoteSaved({
            status: 'DRAFT',
            client: `${clientData.firstName} ${clientData.lastName}`,
            quoteDate: Cypress.moment().format('DD.MM.YYYY'),
            validUntil: Cypress.moment().add(10, 'days').format('DD.MM.YYYY')
        });
    });

    function navigateToQuotes() {
        cy.get('ul.nav li a')
            .contains('Quotes')
            .click();
        cy.get('h3.page-label')
            .contains('Quotes')
            .should('exist')
            .and('be.visible');
    }

    function navigateToNewQuote() {
        cy.get('a[title="Add New"]').click();
        cy.get('h3.page-label')
            .contains('Create Quote')
            .should('exist')
            .and('be.visible');
    }

    function createNewClient({company, firstName, lastName}) {
        cy.get('button[title="Add Client"]').click();
        // TODO: Add support for email, phone, country, payment terms and so on (currently it's out of scope of the task)
        cy.get('div.modal-body').should('exist').within(() => {
            company &&
            cy.get('#companyName').clear().type(company);
            firstName &&
            cy.get('#fName').clear().type(firstName);
            lastName &&
            cy.get('#lName').clear().type(lastName);
            cy.get('button[type="submit"]').click();
        });
        verifyMessage('Person saved successfully!', 'OK');
    }

    function selectClient(client) {
        cy.get('#autosuggest').within(() => {
            cy.get('input').type(client);
            cy.get('div.autosuggest__results ul li ')
                .contains(client)
                .click();
        });
    }

    function addNewProduct(index, {itemCode, description, taxRate, unitCost}) {
        cy.get('#itemDesign tbody tr').eq(index)
            .find('select')
            .first()
            .select('Add New');
        cy.get('div.modal-body').should('exist').within(() => {
            cy.get(`input[type="radio"][value="product"]`).click();
            cy.get('#text-input').type(itemCode);
            cy.get('#textarea-input').type(description);
            cy.get('#taxRate').select(taxRate);
            cy.get('#cost').type(unitCost);
        });
        cy.get('button#draft').click();
        verifyMessage('Product saved successfully!');
    }

    function saveQuoteAsDraft() {
        cy.get('button').contains('Save Draft').click();
    }

    function verifyQuoteSaved({status, client, quoteDate, validUntil, amount}) {
        cy.get('#grid-wrapper div.ag-center-cols-container').within(() => {
            cy.get('div[col-id="client"]').contains(client).should('exist')
                .parents('div[role="row"]').within(() => {
                cy.get('div[col-id="quoteNumber"]').should('contain', status);
                cy.get('div[col-id="quote_date"]').should('contain', quoteDate);
                cy.get('div[col-id="due_date"]').should('contain', validUntil);
                amount &&
                cy.get('div[col-id="amount"]').should('contain', amount.replace('.', ','));
            });
        });
    }

    function verifyMessage(title, buttonToClose = null) {
        cy.get('div.swal2-container')
            .should('exist')
            .and('be.visible').within(() => {
            cy.get('#swal2-title').should('contain', title);
            if (buttonToClose) {
                cy.get('button').contains(buttonToClose).click();
            }
        });
    }
});
