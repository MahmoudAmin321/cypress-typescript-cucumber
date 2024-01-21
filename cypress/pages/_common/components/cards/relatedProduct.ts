import { BaseCard } from "./baseCard";

export class RelatedProductCard extends BaseCard {
  readonly moreInfo: () => Cypress.Chainable<JQuery<HTMLElement>>;

  constructor(cardContainer: () => JQuery<HTMLElement>) {
    super(cardContainer);
    this.moreInfo = () =>
      cy.wrap(cardContainer()).find("a");
  }
}
