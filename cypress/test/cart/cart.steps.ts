import { Then, When } from "@badeball/cypress-cucumber-preprocessor";
import cartPage from "../../pages/cart.pom";
import { CartColumn } from "../../support/models/cartColumn";
import { apis } from "../../support/consts";

Then(
  "You set {cartTableColumn} of {string} to {string}",
  function (
    bddCartColumn: CartColumn,
    bddItemName: string,
    bddQuantity: string
  ) {
    // intercept
    cy.spyApi(apis.cartProductQuantity, "PUT");

    cartPage.getItemCell(bddCartColumn, bddItemName).then((itemCell) => {
      cy.wrap(itemCell)
        .find("input[type=number]")
        .clear()
        .type(`${bddQuantity}{enter}`);

      cy.wait(`@${apis.cartProductQuantity.interceptorName}`);
    });
  }
);

When(
  "You have {cartTableColumn} {string} from cart",
  function (bddAction: CartColumn, bddItemName: string) {
    // intercept
    cy.spyApi(apis.specificCartProduct, "DELETE");
    cy.spyApi(apis.specificCart);

    cartPage.getItemCell(bddAction, bddItemName).then((itemCell) => {
      cy.wrap(itemCell).find("[class*='remove']").click();

      cy.wait(`@${apis.specificCartProduct.interceptorName}`);
      cy.wait(`@${apis.specificCart.interceptorName}`);
    });
  }
);
