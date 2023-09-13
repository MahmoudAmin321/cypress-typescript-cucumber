import { When } from "@badeball/cypress-cucumber-preprocessor";
import { apis } from "../../../support/consts";
import checkBoxAction from "../../../support/models/checboxAction";
import { Base } from "../../../pages/_common/base.pom";
import brandsFactory from "../../../support/models/brands";

When(
  "{word} have {string} {string} brand",
  function (_: string, cBoxAction: string, bddBrandName: string) {
    const index = brandsFactory.getBrandIndex(bddBrandName);

    cy.spyApi(apis.products);
    const chainableCheckBox = Base.brands().eq(index);

    cy.then(() => {
      checkBoxAction.perform(cBoxAction, chainableCheckBox);
    });

    cy.wait(`@${apis.products.interceptorName}`);
  }
);
