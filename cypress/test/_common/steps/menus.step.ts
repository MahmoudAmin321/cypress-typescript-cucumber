import { When } from "@badeball/cypress-cucumber-preprocessor";
import commonElements from "../../../pages/_common/commonElements";
import menus from "../../../support/models/menus";

When(
  "{word} {string} {string} menu, if needed",
  function (_: string, bddAction: string, bddMenuName: string) {
    commonElements.navIcon().then((navIcon) => {
      const isMenuVisible = navIcon.is(":visible");

      //log
      console.log("vis ", isMenuVisible);

      if (isMenuVisible) {
        const chainableMenu = menus.getMenu(bddMenuName);
        menus.performAction(bddAction, chainableMenu);
      }
    });
  }
);

When(
  "{word} {string} {string} menu",
  function (_: string, bddAction: string, bddMenuName: string) {
    const chainableMenu = menus.getMenu(bddMenuName);
    menus.performAction(bddAction, chainableMenu);
  }
);
