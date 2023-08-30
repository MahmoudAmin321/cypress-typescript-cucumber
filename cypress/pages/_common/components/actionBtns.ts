export class ActionBtns {
  readonly edit: () => Cypress.Chainable<JQuery<HTMLElement>>;
  readonly delete: () => Cypress.Chainable<JQuery<HTMLElement>>;

  constructor(rowNr: number) {
    this.edit = () => cy.get("[data-test*=edit]").eq(rowNr - 1);
    this.delete = () => cy.get("[data-test*=delete]").eq(rowNr - 1);
  }
}
