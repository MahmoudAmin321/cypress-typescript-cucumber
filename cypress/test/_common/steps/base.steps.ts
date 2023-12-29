import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
import keyboardFactory from "../../../support/models/keyboardFactory";
import { Base } from "../../../pages/_common/base.pom";
import pagesFactory from "../../../pages/_common/pagesFactory";
import { apis } from "../../../support/consts";
import { apiHost } from "../../../support/cyEnvVar";
import { Factory } from "../../../pages/_common/factory";
import productsApi from "../../../testApi/_common/apiPom/product/productsApi";

// Anti pattern. Only use as exception, when there is No other option
Given("{word} wait {int} seconds", function (_: string, seconds: number) {
  cy.wait(seconds * 1000);
});

When(
  "{word} hit {string} key {int} times",
  function (_: string, bddKeyName: string, times: number) {
    if (times % 2 != 0) {
      throw Error(
        `Instead of ${times} Please provide even number, as cypress hits the key twice, which is weird to me`
      );
    }
    const key = keyboardFactory.getKey(bddKeyName);

    for (let i = 0; i < times / 2; i++) {
      Base.body().type(key);
    }
  }
);

When(
  "{word} set text field {string} of {string} page to {string}",
  function (
    _: string,
    bddTextFieldName: string,
    bddPageName: string,
    bddIncomigValue: string
  ) {
    const page: Base = pagesFactory.getPage(bddPageName);
    const textField = page.getTextField(bddTextFieldName);

    textField.clear().type(bddIncomigValue);
  }
);

When(
  "{word} set dropdown {string} of {string} page to {string}",
  function (
    _: string,
    bddDropdownName: string,
    bddPageName: string,
    bddIncomingOption: string
  ) {
    const page: Base = pagesFactory.getPage(bddPageName);
    const dropdown = page.getDropdown(bddDropdownName);

    dropdown.select(bddIncomingOption);
  }
);

Then("Paginator {string}", function (bddAssertion: string) {
  const assertion = Factory.getAssertion(bddAssertion);
  Base.paginator().should(assertion);
});

When(
  "You have {string} product opened from {string} side",
  function (bddProductName: string, bddSide: string) {
    const productPage = pagesFactory.getProductPage(bddSide);

    // GET all products of all pages in one array
    const products: object[] = [];
    productsApi.get().then((productsResp) => {
      // get last page
      const lastPage: number = productsResp.body.last_page;
      for (let nr = 1; nr <= lastPage; nr++) {
        productsApi
          .get(`${apiHost}${apis.products.relativeUrl()}?page=${nr}`)
          .then((productsResp) => {
            const currentPageProducts: object[] = productsResp.body.data;
            products.push(...currentPageProducts);
          });
      }
    });

    cy.then(() => {
      // search for target product
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        if (product["name"].toLowerCase() === bddProductName.toLowerCase()) {
          // store id of the target product
          productPage.storedId = product["id"];
          break;
        }
      }
      // throw error if product Not found in products
      cy.then(() => {
        if (!productPage.storedId) {
          throw new Error("product Not found");
        }
      });
    });

    // open the product url using the stored id
    cy.then(() => {
      cy.spyApi(apis.specificProduct);
      cy.visit(productPage.relativeUrl(productPage.storedId));
      cy.wait(`@${apis.specificProduct.interceptorName}`);
    });
  }
);

Then("Cart icon {string}", function (bddAssertion: string) {
  const assertion = Factory.getAssertion(bddAssertion);
  Base.cartIcon().should(assertion);
});
