import { Then, When } from "@badeball/cypress-cucumber-preprocessor";
import addCategoryPage from "../../pages/admin/categoryForm/addCategory.pom";
import categoriesPage from "../../pages/admin/categories.pom";
import { apis } from "../../support/consts";
import homePage from "../../pages/home.pom";
import { Base } from "../../pages/_common/base.pom";

Then("option {string} exists", function (bddExactOptionName: string) {
  addCategoryPage.dropdowns
    .parentId()
    .find("option")
    .should("contain.text", bddExactOptionName);
});

When("You search for category {string}", function (bddCategoryName: string) {
  // spy
  cy.spyApi(apis.SearchIncategories);

  // do action
  categoriesPage.searchField().type(bddCategoryName);
  categoriesPage.searchBtn().click();

  cy.wait(1500);

  // wait
  cy.wait(`@${apis.SearchIncategories.interceptorName}`);
});

Then(
  "You find category {string} in parent categories",
  function (bddCategoryName: string) {
    // Find the checkbox with the specific text
    cy.contains("label", bddCategoryName)
      .children("[data-test^='category']")
      .eq(0)
      .then(($categoryElement) => {
        // Get the data-test value of this category
        const categoryId = $categoryElement.attr("data-test");

        // Verify this category exists in the parent categories list
        Base.parentCategories().then(($parentCategories) => {
          // Convert to array of data-test attributes
          const parentIds = $parentCategories
            .map((i, el) => el.getAttribute("data-test"))
            .get();

          // Assert our category exists in parent categories
          expect(parentIds).to.include(categoryId);
        });
      });
  }
);
