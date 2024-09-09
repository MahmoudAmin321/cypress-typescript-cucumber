import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
import keyboardFactory from "../../../support/models/keyboardFactory";
import { Base } from "../../../pages/_common/base.pom";
import pagesFactory from "../../../pages/_common/pagesFactory";
import { apis, undefinedNr } from "../../../support/consts";
import { Factory } from "../../../pages/_common/factory";
import productsApi from "../../../testApi/_common/apiPom/product/productsApi";
import productDetailsPage from "../../../pages/productDetails.pom";
import cartPage from "../../../pages/cart.pom";
import { CartColumn } from "../../../support/models/cartColumn";

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
    bddIncomingValue: string
  ) {
    const page: Base = pagesFactory.getPage(bddPageName);
    const textField = page.getTextField(bddTextFieldName);

    textField.clear().type(bddIncomingValue);
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
    productsApi.getAllProducts().then((products) => {
      // search for target product and store it
      productPage.storedId = productsApi.search(bddProductName, products);
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

Then(
  "{cartTableColumn} of {string} is {string}",
  function (
    bddCartColumn: CartColumn,
    bddItemName: string,
    expectedValue: string
  ) {
    cartPage.getItemCell(bddCartColumn, bddItemName).then((itemCell) => {
      // assert
      if (bddCartColumn.name.trim().toLowerCase() === "quantity") {
        cy.wrap(itemCell)
          .find("input[type=number]")
          .invoke("val")
          .should("eq", expectedValue);
      } else {
        expect(itemCell.text().trim().toLowerCase()).to.eq(
          expectedValue.trim().toLowerCase()
        );
      }
    });
  }
);

Then("Cart total price is {string}", function (expectedPrice: string) {
  const columnName = new CartColumn("cart total price").name;
  cartPage.getColumnIndex(columnName).then((columnIndex) => {
    cartPage.cartStep.itemsTable
      .footerCells()
      .eq(columnIndex)
      .then((cartTotalPriceCell) => {
        expect(cartTotalPriceCell.text().trim()).to.eq(expectedPrice);
      });
  });
});

When("You add product to {string}", function (bddAddBtnName: string) {
  productDetailsPage.getButtonAndItsAssociations(bddAddBtnName).btn().click();

  // static wait for unhappy cases
  cy.wait(1500);
});

When("You have added product to {string}", function (bddAddBtnName: string) {
  // intercept
  productDetailsPage.getButtonAndItsAssociations(bddAddBtnName).spy();

  productDetailsPage.getButtonAndItsAssociations(bddAddBtnName).btn().click();

  productDetailsPage.getButtonAndItsAssociations(bddAddBtnName).wait();
});

When("You set quantity to {string}", function (quantity: string) {
  productDetailsPage.details.quantity().clear().type(quantity);
});

Then(
  "{string} quantity is {string}",
  function (bddType: string, bddQuantity: string) {
    Factory.getQuantityText(bddType).should("equal", bddQuantity);
  }
);

Then(
  "Item {string} of {string} page {string}",
  function (bddItemName: string, bddPageName: string, bddAssertion: string) {
    const chainableItems = Factory.getChainableItems(bddPageName);
    // search for item
    Base.searchInItems(chainableItems, bddItemName).then((itemIndex) => {
      // assert
      if (bddAssertion.toLowerCase().match(/^exist/)) {
        expect(itemIndex).to.not.eq(undefined);
        expect(itemIndex).to.be.a("number");
      } else if (bddAssertion.toLowerCase().match(/n(o|')t /)) {
        expect(itemIndex).to.eq(undefinedNr);
      } else {
        throw Error(`Invalid expected result [${bddAssertion}].`);
      }
    });
  }
);

When(
  "You set {string} {string} field to {string}",
  function (bddPageName: string, bddFieldName: string, bddFieldValue: string) {
    const field = Factory.getField(bddPageName, bddFieldName);

    // need the wait before clear to wait the app to load the field value, then clear it
    // otherwise, clear occurs before load, hence field has value again
    // reference: https://github.com/cypress-io/cypress/issues/4937#issuecomment-518694485
    cy.wait(1500);

    if (bddFieldValue) {
      field.clear().type(bddFieldValue).should("have.value", bddFieldValue);
    } else {
      field.clear().should("have.value", "");
    }
  }
);

Then(
  "{string} {string} field value is {string}",
  function (bddPageName: string, bddFieldName: string, expectedValue: string) {
    const field = Factory.getField(bddPageName, bddFieldName);
    field.invoke("val").should("eq", expectedValue);
  }
);
