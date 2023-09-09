import { When } from "@badeball/cypress-cucumber-preprocessor";
import categoriesFactory from "../../../support/models/categories";
import { apis } from "../../../support/consts";
import checkBoxAction from "../../../support/models/checboxAction";
import { Base } from "../../../pages/_common/base.pom";

When(
  "{word} have {string} {string} category",
  function (_: string, cBoxAction: string, bddCategoryName: string) {
    const index = categoriesFactory.getCategoryIndex(bddCategoryName);

    cy.spyApi(apis.products);
    const chainableCheckBox = Base.categories().eq(index);

    cy.then(() => {
      checkBoxAction.perform(cBoxAction, chainableCheckBox);
    });

    cy.wait(`@${apis.products.interceptorName}`);
  }
);
