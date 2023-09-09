import { Base } from "../../pages/_common/base.pom";

class Menus {
  getMenu(bddMenuName: string): Cypress.Chainable<JQuery<HTMLElement>> {
    const lower = bddMenuName.toLowerCase();
    if (lower.toLowerCase().match(/navigation/)) {
      return Base.navIcon();
    } else if (lower.toLowerCase().match(/user/)) {
      return Base.userNavMenu.menu();
    } else if (lower.toLowerCase().match(/categor/)) {
      return Base.categoriesNavMenu.menu();
    } else {
      throw Error(`Menu name [ ${bddMenuName} ] doesn't exist in the map`);
    }
  }

  performAction(
    bddMenuAction: string,
    chainableMenu: Cypress.Chainable<JQuery<HTMLElement>>
  ) {
    const lower = bddMenuAction.toLowerCase();
    if (lower.toLowerCase().match(/expand/)) {
      return chainableMenu.then((menu) => {
        //log
        console.log("att ", menu.attr("aria-expanded"));

        if (menu.attr("aria-expanded") === "false") {
          return cy.wrap(menu).click();
        }
      });
    } else if (lower.toLowerCase().match(/collapse/)) {
      return chainableMenu.then((menu) => {
        if (menu.attr("aria-expanded") === "true") {
          return cy.wrap(menu).click();
        }
      });
    } else {
      throw Error(`Menu action [ ${bddMenuAction} ] doesn't exist in the map`);
    }
  }
}

const menus = new Menus();
export default menus;
