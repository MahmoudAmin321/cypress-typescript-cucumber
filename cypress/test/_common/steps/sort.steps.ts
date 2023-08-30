import { Then, When } from "@badeball/cypress-cucumber-preprocessor";
import commonElements from "../../../pages/_common/commonElements";
import { SortOptions } from "../../../support/models/sort/_sortOptions";
import { apis } from "../../../support/consts";
import sortFactory from "../../../support/models/sort/_sortFactory";

When(
  "{word} have {sortOption} sort option selected",
  function (_: string, bddSortOption: SortOptions) {
    //spy
    cy.spyApi(apis.products);

    // select
    commonElements.sortDropdown().select(bddSortOption.sortOptionValue);

    // wait
    cy.wait(`@${apis.products.interceptorName}`);
  }
);

Then(
  "Products should be sorted by {string} in {string} order",
  function (bddSortBy: string, bddSortOrder: string) {
    const sortOrder = sortFactory.getSortOrder(bddSortOrder);
    const desiredSort = sortFactory.getDesiredSort(bddSortBy);

    desiredSort.assertSort(sortOrder);
  }
);
