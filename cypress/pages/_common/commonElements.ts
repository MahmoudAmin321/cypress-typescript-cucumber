class CommonElements {
  readonly body = () => cy.get("body");

  readonly userMenu = {
    menu: () => cy.get("[data-test$=menu]"),
    myAccount: () => cy.get("[href$=account]"),
    dashboard: () => cy.get("[data-test$=dashboard]"),
  };

  readonly footer = {
    githubRepo: () => cy.get("[href*=github]"),
    privacyPolicy: () => cy.get("[href*=privacy]"),
  };

  readonly sortDropdown = () => cy.get("[data-test=sort]");

  readonly categories = () =>
    cy.get("[data-test=filters] [data-test^=category]");

  readonly brands = () => cy.get("[data-test=filters] [data-test^=brand]");

  /**
   * Creates a map between business common button name (BDD name) and chainable common button
   * @param bddBtnName
   * @returns The chainable common button of the provided BDD name. If the BDD name is invalid, an error is thrown
   */
  getButton(bddBtnName: string) {
    if (bddBtnName.toLowerCase().match(/user( *)(menu)*/)) {
      return this.userMenu.menu();
    } else if (bddBtnName.toLowerCase().match(/(my)*( *)account/)) {
      return this.userMenu.myAccount();
    } else if (bddBtnName.toLowerCase().match(/dash(.*)/)) {
      return this.userMenu.dashboard();
    } else {
      throw Error(`Common button [ ${bddBtnName} ] doesn't exist in the map`);
    }
  }
}

const commonElements = new CommonElements();
export default commonElements;
