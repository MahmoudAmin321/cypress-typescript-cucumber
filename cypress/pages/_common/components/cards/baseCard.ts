// must export here, then import in subclass. Otherwise you get runtime error "BaseCard is Not defined"
export class BaseCard {
  readonly image: () => Cypress.Chainable<JQuery<HTMLElement>>;
  readonly name: () => Cypress.Chainable<JQuery<HTMLElement>>;

  constructor(cardContainer: () => JQuery<HTMLElement>) {
    this.image = () => cy.wrap(cardContainer()).find("img");
    this.name = () => cy.wrap(cardContainer()).find("[class=card-title]");
  }
}
