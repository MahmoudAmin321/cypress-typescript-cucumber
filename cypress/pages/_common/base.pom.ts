import { ApiInfo } from "../../support/models/api";
import { ActionBtns } from "./components/actionBtns";

export abstract class Base {
  abstract readonly relativeUrl: (...args) => string;

  readonly priceRegex = /\$(\d+)\.(\d+)/;

  readonly nthActionBtns = (rowNr: number) => new ActionBtns(rowNr);

  getApiInfo(): ApiInfo {
    return null;
  }

  abstract waitForPage(): Cypress.Chainable<any>;

  assertPage(...args): Cypress.Chainable<any> {
    return null;
  }

  abstract getButton(bddBtnName: string): Cypress.Chainable<any>;

  getTextField(
    bddTextFieldName: string
  ): Cypress.Chainable<JQuery<HTMLElement>> {
    return null;
  }

  getDropdown(bddDropdownName: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return null;
  }

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
