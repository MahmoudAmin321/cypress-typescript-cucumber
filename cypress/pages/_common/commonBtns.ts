class CommonBtns {
  readonly userMenu = {
    menu: () => cy.get("[data-test$=menu]"),
    myAccount: () => cy.get("[href$=account]"),
    dashboard: () => cy.get("[data-test$=dashboard]"),
  };

  readonly footer = {
    githubRepo: () => cy.get("[href*=github]"),
    privacyPolicy: () => cy.get("[href*=privacy]"),
  };

  /**
   * Creates a map between business common button name (BDD name) and chainable common button
   * @param bddBtnName
   * @returns The chainable common button of the provided BDD name. If the BDD name is invalid, an error is thrown
   */
  getCommonButton(bddBtnName: string) {
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

const commonBtns = new CommonBtns();
export default commonBtns;