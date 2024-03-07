import { Then } from "@badeball/cypress-cucumber-preprocessor";
import cartPage from "../../pages/cart.pom";
import { CartColumn } from "../../support/models/cartColumn";

Then(
  "You set {cartTableColumn} of {string} to {string}",
  function (
    bddCartColumn: CartColumn,
    bddItemName: string,
    bddQuantity: string
  ) {
    cartPage.getItemCell(bddCartColumn, bddItemName).then((itemCell) => {
      cy.wrap(itemCell)
        .find("input[type=number]")
        .clear()
        .type(`${bddQuantity}{enter}`);
      cy.wait(1500);
    });
  }
);
