import { When } from "@badeball/cypress-cucumber-preprocessor";
import categoriesFactory from "../../../support/models/categories";
import commonElements from "../../../pages/_common/commonElements";
import { apis } from "../../../support/consts";

When(
  "{word} have selected {string} category",
  function (_: string, bddCategoryName: string) {
    const index = categoriesFactory.getCategoryIndex(bddCategoryName);

    cy.spyApi(apis.products);
    commonElements.categories().eq(index).check();
    cy.wait(`@${apis.products.interceptorName}`);
  }
);
