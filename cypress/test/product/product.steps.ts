import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
import homePage from "../../pages/home.pom";
import productCardInfo from "../../pages/_common/product/productCardInfo";
import { apis } from "../../support/consts";
import productDetailsPage from "../../pages/productDetails.pom";
import { Factory } from "../../pages/_common/factory";
import brandsApi from "../../testApi/_common/apiPom/brand/brandsApi";
import cartPage from "../../pages/cart.pom";
import { CartColumn } from "../../support/models/cartColumn";
import { ToasterType } from "../../support/models/toaterType";

When(
  "{word} store details of {int}. card",
  function (_: string, cardNr: number) {
    homePage.productCards().then(($cards) => {
      const card = $cards[cardNr - 1];
      card
        .image()
        .invoke("attr", "src")
        .then((src: string) => {
          productCardInfo.image.src = src.trim();
        });

      card
        .name()
        .invoke("text")
        .then((text: string) => {
          productCardInfo.name.text = text.trim();
        });

      card
        .price()
        .invoke("text")
        .then((price: string) => {
          productCardInfo.price.text = price.trim();
        });
    });
  }
);

When("{word} have {int}. card opened", function (_: string, cardNr: number) {
  homePage.productCards().then(($cards) => {
    const card = $cards[cardNr - 1];
    cy.spyApi(apis.specificProduct);
    card.name().click();
    productDetailsPage.waitForPage();
  });
});

Then("Product details should be same as in card", function () {
  productDetailsPage.details
    .image()
    .invoke("attr", "src")
    .should("eq", productCardInfo.image.src);

  productDetailsPage.details
    .name()
    .invoke("text")
    .should("eq", productCardInfo.name.text);

  productDetailsPage.details
    .unitPrice()
    .invoke("text")
    .then((text) => {
      expect(`$${text}`).to.eq(productCardInfo.price.text);
    });
});

When("You increase quantity", function () {
  productDetailsPage.details.increaseQuantity().click();
});

When("You decrease quantity", function () {
  productDetailsPage.details.decreaseQuantity().click();
});

When("You set quantity to {string}", function (quantity: string) {
  productDetailsPage.details.quantity().clear().type(quantity);
});

When("You add product to {string}", function (bddAddBtnName: string) {
  productDetailsPage.getButton(bddAddBtnName).click();
});

Then(
  "{string} quantity is {string}",
  function (bddType: string, bddQuantity: string) {
    Factory.getQuantityText(bddType).should("equal", bddQuantity);
  }
);

Then(
  "{toasterType} toaster {string}",
  function (bddToasterType: ToasterType, bddAssertion: string) {
    const assertion = Factory.getAssertion(bddAssertion);

    productDetailsPage.getToaster(bddToasterType.type).should(assertion);
  }
);

Given("You programmatically prepare brands data", function () {
  brandsApi.cleanUp();
  brandsApi.setUp();
});

Then(
  "Row of item {string} {string}",
  function (bddProductName: string, bddAssertion: string) {
    // search item in cart
    cartPage.searchInItems(bddProductName).then((itemIndex) => {
      // assert
      if (bddAssertion.toLowerCase().match(/^exist/)) {
        expect(itemIndex).to.not.eq(undefined);
        expect(itemIndex).to.be.a("number");
      } else if (bddAssertion.toLowerCase().match(/n(o|')t /)) {
        expect(itemIndex).to.be(undefined);
      } else {
        throw Error(`Invalid expected result [${bddAssertion}].`);
      }
    });
  }
);

Then(
  "{cartTableColumn} of {string} is {string}",
  function (
    bddCartColumn: CartColumn,
    bddItemName: string,
    expectedValue: string
  ) {
    // search item in cart
    cartPage.searchInItems(bddItemName).then((itemIndex) => {
      // assert
      cy.then(() => {
        if (itemIndex == undefined) {
          throw Error(`Item ${bddItemName} doesn't exist in the cart`);
        }
        cartPage.getColumnIndex(bddCartColumn.name).then((columnIndex) => {
          cartPage.itemsTable
            .items()
            .eq(itemIndex)
            .within(() => {
              cy.get("td")
                .eq(columnIndex)
                .then((itemCell) => {
                  if (bddCartColumn.name.toLowerCase() === "quantity") {
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
            });
        });
      });
    });
  }
);

Then("Cart total price is {string}", function (expectedPrice: string) {
  const columnName = new CartColumn("cart total price").name;
  cartPage.getColumnIndex(columnName).then((columnIndex) => {
    cartPage.itemsTable
      .footerCells()
      .eq(columnIndex)
      .then((cartTotalPriceCell) => {
        expect(cartTotalPriceCell.text().trim()).to.eq(expectedPrice);
      });
  });
});

Then(
  "{toasterType} toaster contain(s) text {string}",
  function (bddToasterType: ToasterType, expectedText: string) {
    productDetailsPage;
    productDetailsPage
      .getToaster(bddToasterType.type)
      .invoke("text")
      .then((text: string) => {
        expect(text.trim().toLowerCase()).to.contain(expectedText);
      });
  }
);
