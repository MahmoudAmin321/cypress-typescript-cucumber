import { undefinedNr } from "../../support/consts";
import { ApiInfo } from "../../support/models/api";
import { ActionBtns } from "./components/actionBtns";

export abstract class Base {
  abstract readonly relativeUrl: (...args) => string;

  readonly priceRegex = /\$(\d+)\.(\d+)/;

  readonly nthActionBtns = (rowNr: number) => new ActionBtns(rowNr);

  static readonly body = () => cy.get("body");

  static readonly navIcon = () => cy.get("[class=navbar-toggler][type=button]");

  static readonly userNavMenu = {
    // admin
    dashboard: () => cy.get("[data-test$=dashboard]"),
    products: () => cy.get("[data-test=nav-admin-products]"),
    // customer
    myAccount: () => cy.get("[href$=account]"),
    myFavorites: () => cy.get("[data-test=nav-my-favorites]"),
    // both
    menu: () => cy.get("[data-test$=menu]"),
  };

  static readonly categoriesNavMenu = {
    menu: () => cy.get("[data-test=nav-categories]"),
    handTools: () => cy.get("[data-test=nav-hand-tools]"),
  };

  static readonly cartIcon = () => cy.get("[data-test=nav-cart]");

  static readonly cartQuantity = () =>
    Base.cartIcon().find("[data-test=cart-quantity]");

  static readonly footer = {
    githubRepo: () => cy.get("[href*=github]"),
    privacyPolicy: () => cy.get("[href*=privacy]"),
  };

  static readonly sortDropdown = () => cy.get("[data-test=sort]");

  static readonly categories = () =>
    cy.get("[data-test=filters] [data-test^=category]");

  static readonly brands = () =>
    cy.get("[data-test=filters] [data-test^=brand]");

  static readonly specificBrand = (id:string) => 
    Base.brands().filter(`[value='${id}']`) 

  static readonly saveBtn = () => cy.get("[data-test=product-submit]");

  static readonly resetBtn = () => cy.get("[data-test$=reset]");

  static readonly paginator = () => cy.get("app-pagination .pagination");

  static readonly addressFields= {
    address: () => cy.get("[data-test=address]"),
    city: () => cy.get("[data-test=city]"),
    state: () => cy.get("[data-test=state]"),
    country: () => cy.get("[data-test=country]"),
    postcode: () => cy.get("[data-test=postcode]"),
  }

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

  /**
   * Creates a map between business common button name (BDD name) and chainable common button
   * @param bddBtnName
   * @returns The chainable common button of the provided BDD name. If the BDD name is invalid, an error is thrown
   */
  static getButton(bddBtnName: string) {
    const lower = bddBtnName.trim().toLowerCase();
    if (lower.match(/dash(.*)/)) {
      return Base.userNavMenu.dashboard();
    } else if (lower.match(/products/)) {
      return Base.userNavMenu.products();
    } else if (lower.match(/(my)*( *)account/)) {
      return Base.userNavMenu.myAccount();
    } else if (lower.match(/my( *)favo/)) {
      return Base.userNavMenu.myFavorites();
    } else if (lower.match(/user( *)(menu)*/)) {
      return Base.userNavMenu.menu();
    } else if (lower.match(/cart/)) {
      return Base.cartIcon();
    } else {
      throw Error(`Common button [ ${bddBtnName} ] doesn't exist in the map`);
    }
  }

  static searchInItems(chainableItems: Cypress.Chainable<any>, itemName: string): Cypress.Chainable<number> {
    return chainableItems.then((items: any) => {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (
          item.innerText.trim().toLowerCase().match(RegExp(itemName.trim().toLowerCase()))
        ) {
          // return index of the found item
          return i;
        }
      }

      return undefinedNr;
    });
  }
 
}
