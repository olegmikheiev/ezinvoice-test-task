export function loginAs(email, password) {
    cy.visit('/login');
    cy.get('#email').clear().type(email);
    cy.get('#password').clear().type(password);
    cy.get('button.btn-login').click();
}
