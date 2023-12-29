import { When } from "@badeball/cypress-cucumber-preprocessor";
import menus from "../../../support/models/menus";

When(
  "{word} {string} {string} mobile menu, if needed",
  function (_: string, bddAction: string, bddMenuName: string) {
    const chainableMenu = menus.getMobileMenu(bddMenuName);
    chainableMenu.then((menu) => {
      const isMenuVisible = menu.is(":visible");
      if (isMenuVisible) {
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
