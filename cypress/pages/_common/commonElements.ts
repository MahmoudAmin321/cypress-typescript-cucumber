class CommonElements {
  readonly body = () => cy.get("body");

  readonly navIcon = () => cy.get("[class=navbar-toggler][type=button]")

  readonly userNavMenu = {
    menu: () => cy.get("[data-test$=menu]"),
    myAccount: () => cy.get("[href$=account]"),
    dashboard: () => cy.get("[data-test$=dashboard]"),
    products: ()=> cy.get("[data-test=nav-admin-products]")
  };

  readonly categoriesNavMenu = {
    menu: () => cy.get("[data-test=nav-categories]"),
    handTools: () => cy.get("[data-test=nav-hand-tools]"),
  };

  readonly footer = {
    githubRepo: () => cy.get("[href*=github]"),
    privacyPolicy: () => cy.get("[href*=privacy]"),
  };

  readonly sortDropdown = () => cy.get("[data-test=sort]");

  readonly categories = () =>
    cy.get("[data-test=filters] [data-test^=category]");

  readonly brands = () => cy.get("[data-test=filters] [data-test^=brand]");

  readonly saveBtn = () => cy.get("[data-test=product-submit")

  /**
   * Creates a map between business common button name (BDD name) and chainable common button
   * @param bddBtnName
   * @returns The chainable common button of the provided BDD name. If the BDD name is invalid, an error is thrown
   */
  getButton(bddBtnName: string) {
    if (bddBtnName.toLowerCase().match(/user( *)(menu)*/)) {
      return this.userNavMenu.menu();
    } else if (bddBtnName.toLowerCase().match(/(my)*( *)account/)) {
      return this.userNavMenu.myAccount();
    } else if (bddBtnName.toLowerCase().match(/dash(.*)/)) {
      return this.userNavMenu.dashboard();
    } 
    else if (bddBtnName.toLowerCase().match(/products/)) {
      return this.userNavMenu.products();
    } else {
      throw Error(`Common button [ ${bddBtnName} ] doesn't exist in the map`);
    }
  }
}

const commonElements = new CommonElements();
export default commonElements;
