export class ProductCard {
  readonly image: () => Cypress.Chainable<JQuery<HTMLElement>>;
  readonly name: () => Cypress.Chainable<JQuery<HTMLElement>>;
  readonly price: () => Cypress.Chainable<JQuery<HTMLElement>>;

  constructor(cardContainer: () => JQuery<HTMLElement>) {
    this.image = () => cy.wrap(cardContainer()).find("img");
    this.name = () => cy.wrap(cardContainer()).find("[data-test=product-name]");
    this.price = () =>
      cy.wrap(cardContainer()).find("[data-test=product-price]");
  }
}
