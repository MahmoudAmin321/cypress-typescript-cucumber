export class Favorite {
  readonly image: () => Cypress.Chainable<JQuery<HTMLElement>>;
  readonly name: () => Cypress.Chainable<JQuery<HTMLElement>>;
  readonly description: () => Cypress.Chainable<JQuery<HTMLElement>>;
  readonly deleteBtn: () => Cypress.Chainable<JQuery<HTMLElement>>;

  constructor(favoriteContainer: () => JQuery<HTMLElement>) {
    this.image = () => cy.wrap(favoriteContainer()).find("img");
    this.name = () =>
      cy.wrap(favoriteContainer()).find("[data-test=product-name]");
    this.description = () =>
      cy.wrap(favoriteContainer()).find("[data-test=product-description]");
    this.deleteBtn = () =>
      cy.wrap(favoriteContainer()).find("[data-test=delete ]");
  }
}
