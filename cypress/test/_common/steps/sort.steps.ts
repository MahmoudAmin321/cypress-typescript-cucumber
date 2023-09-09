import { Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { SortOptions } from "../../../support/models/sort/_sortOptions";
import { apis } from "../../../support/consts";
import sortFactory from "../../../support/models/sort/_sortFactory";
import { Base } from "../../../pages/_common/base.pom";

When(
  "{word} have {sortOption} sort option selected",
  function (_: string, bddSortOption: SortOptions) {
    //spy
    cy.spyApi(apis.products);

    // select
    Base.sortDropdown().select(bddSortOption.sortOptionValue);

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
