import { Then, When } from "@badeball/cypress-cucumber-preprocessor";
import cartPage from "../../pages/cart.pom";
import { CartColumn } from "../../support/models/cartColumn";
import { apis } from "../../support/consts";
import { Factory } from "../../pages/_common/factory";

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

When(
  "You click on proceed button of {string} step",
  function (bddStepName: string) {
    const step = cartPage.getStep(bddStepName);
    step.proceedBtn().click();
  }
);

Then(
  "{string} step {string}",
  function (bddStepName: string, bddAssertion: string) {
    const step = cartPage.getStep(bddStepName);
    const assertion = Factory.getAssertion(bddAssertion);
    step.container().should(assertion);
  }
);

Then(
  "{string} step {string} text {string}",
  function (bddStepName: string, bddAssertion: string, bddText: string) {
    const step = cartPage.getStep(bddStepName);
    const assertion = Factory.getAssertion(bddAssertion);
    step.container().should(`${assertion}.text`, bddText);
  }
);

Then(
  "proceed button of {string} step {string}",
  function (bddStepName: string, bddAssertion: string) {
    const step = cartPage.getStep(bddStepName);
    const assertion = Factory.getAssertion(bddAssertion);
    step.proceedBtn().should(assertion);
  }
);
