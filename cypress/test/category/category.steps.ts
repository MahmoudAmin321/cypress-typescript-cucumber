import { Then, When } from "@badeball/cypress-cucumber-preprocessor";
import addCategoryPage from "../../pages/admin/categoryForm/addCategory.pom";
import categoriesPage from "../../pages/admin/categories.pom";
import { apis } from "../../support/consts";

Then("option {string} exists", function (bddExactOptionName: string) {
  addCategoryPage.dropdowns
    .parentId()
    .find("option")
    .should("contain.text", bddExactOptionName);
});

When("You search for category {string}", function (bddCategoryName: string) {
  // log 
  console.log("sic ", apis.SearchIncategories)
  
  // spy
  cy.spyApi(apis.SearchIncategories);

  // do action
  categoriesPage.searchField().type(bddCategoryName);
  categoriesPage.searchBtn().click();

  // wait
  cy.wait(`@${apis.SearchIncategories.interceptorName}`);
});
