import { ApiInfo } from "../../support/models/api";
import { ActionBtns } from "./components/actionBtns";

export abstract class Base {
  abstract readonly relativeUrl: (...args) => string;

  readonly priceRegex = /\$(\d+)\.(\d+)/;

  readonly nthActionBtns = (rowNr: number) => new ActionBtns(rowNr);

  static readonly body = () => cy.get("body");

  static readonly navIcon = () => cy.get("[class=navbar-toggler][type=button]");

  static readonly userNavMenu = {
    menu: () => cy.get("[data-test$=menu]"),
    myAccount: () => cy.get("[href$=account]"),
    dashboard: () => cy.get("[data-test$=dashboard]"),
    products: () => cy.get("[data-test=nav-admin-products]"),
  };

  static readonly categoriesNavMenu = {
    menu: () => cy.get("[data-test=nav-categories]"),
    handTools: () => cy.get("[data-test=nav-hand-tools]"),
  };

  static readonly footer = {
    githubRepo: () => cy.get("[href*=github]"),
    privacyPolicy: () => cy.get("[href*=privacy]"),
  };

  static readonly sortDropdown = () => cy.get("[data-test=sort]");

  static readonly categories = () =>
    cy.get("[data-test=filters] [data-test^=category]");

  static readonly brands = () =>
    cy.get("[data-test=filters] [data-test^=brand]");

  static readonly saveBtn = () => cy.get("[data-test=product-submit]");

  static readonly resetBtn = () => cy.get("[data-test$=reset]");

  static readonly paginator = () => cy.get(".ngx-pagination");

  getApiInfo(): ApiInfo {
    return null;
  }

  abstract waitForPage(): Cypress.Chainable<any>;

  assertPage(...args): Cypress.Chainable<any> {
    return null;
  }

  abstract getButton(bddBtnName: string): Cypress.Chainable<any>;

  
  /**
   * Creates a map between business common button name (BDD name) and chainable common button
   * @param bddBtnName
   * @returns The chainable common button of the provided BDD name. If the BDD name is invalid, an error is thrown
   */
  static getButton(bddBtnName: string) {
    if (bddBtnName.toLowerCase().match(/user( *)(menu)*/)) {
      return Base.userNavMenu.menu();
    } else if (bddBtnName.toLowerCase().match(/(my)*( *)account/)) {
      return Base.userNavMenu.myAccount();
    } else if (bddBtnName.toLowerCase().match(/dash(.*)/)) {
      return Base.userNavMenu.dashboard();
    } else if (bddBtnName.toLowerCase().match(/products/)) {
      return Base.userNavMenu.products();
    } else {
      throw Error(`Common button [ ${bddBtnName} ] doesn't exist in the map`);
    }
  }

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
