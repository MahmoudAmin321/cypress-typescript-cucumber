import { BaseCard } from "./baseCard";

export class Favorite extends BaseCard {
  readonly description: () => Cypress.Chainable<JQuery<HTMLElement>>;
  readonly deleteBtn: () => Cypress.Chainable<JQuery<HTMLElement>>;

  constructor(favoriteContainer: () => JQuery<HTMLElement>) {
    super(favoriteContainer);
    this.description = () =>
      cy.wrap(favoriteContainer()).find("[data-test=product-description]");
    this.deleteBtn = () =>
      cy.wrap(favoriteContainer()).find("[data-test=delete ]");
  }
}
