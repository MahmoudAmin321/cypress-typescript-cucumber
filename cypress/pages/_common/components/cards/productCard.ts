import { BaseCard } from "./baseCard";

export class ProductCard extends BaseCard {
  readonly price: () => Cypress.Chainable<JQuery<HTMLElement>>;

  constructor(cardContainer: () => JQuery<HTMLElement>) {
    super(cardContainer);
    this.price = () =>
      cy.wrap(cardContainer()).find("[data-test=product-price]");
  }
}
