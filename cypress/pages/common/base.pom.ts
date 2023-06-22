import { ApiInfo } from "../../support/models/apiInfo";

export abstract class Base {
  abstract readonly relativeUrl: string;

  getApiInfo(): ApiInfo {
    return null;
  }

  abstract waitForPage(): Cypress.Chainable<any>;

  assertPage() {
    return null;
  }

  abstract getButton(businessBtnName: string): Cypress.Chainable<any>;

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
