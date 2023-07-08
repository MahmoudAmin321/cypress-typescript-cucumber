import { ApiInfo } from "../../support/models/api";

export abstract class Base {
  abstract readonly relativeUrl: string;

  readonly priceRegex = /\$(\d+)\.(\d+)/;

  readonly sortDropdown = () => cy.get("[data-test=sort]");

  getApiInfo(): ApiInfo {
    return null;
  }

  abstract waitForPage(): Cypress.Chainable<any>;

  assertPage(): Cypress.Chainable<any> {
    return null;
  }

  abstract getButton(bddBtnName: string): Cypress.Chainable<any>;

  typeInField(
    inputData: string,
    field: Cypress.Chainable<JQuery<HTMLElement>>,
    clearBeforeTyping: boolean = true
  ) {
    if (clearBeforeTyping) {
      field.clear();
    }
    return field.type(inputData);
  }
}
