import { When } from "@badeball/cypress-cucumber-preprocessor";
import menus from "../../../support/models/menus";
import { Base } from "../../../pages/_common/base.pom";

When(
  "{word} {string} {string} menu, if needed",
  function (_: string, bddAction: string, bddMenuName: string) {
    Base.navIcon().then((navIcon) => {
      const isMenuVisible = navIcon.is(":visible");

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
