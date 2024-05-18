import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
import homePage from "../../pages/home.pom";
import productCardInfo from "../../pages/_common/product/productCardInfo";
import { apis, tokenKeyName, undefinedNr } from "../../support/consts";
import productDetailsPage from "../../pages/productDetails.pom";
import { Factory } from "../../pages/_common/factory";
import brandsApi from "../../testApi/_common/apiPom/brand/brandsApi";
import { ToasterType } from "../../support/models/toaterType";
import myFavoritesPage from "../../pages/customer/myFavorites.pom";
import { User } from "../../support/models/userInfo";
import favoritesApi from "../../testApi/_common/apiPom/favorite/favoritesApi";
import loginApi from "../../testApi/_common/apiPom/user/loginApi";
import { Base } from "../../pages/_common/base.pom";
import { Favorite } from "../../pages/_common/components/cards/favorite";
import { Helper } from "../../support/helper";
import { RelatedProductCard } from "../../pages/_common/components/cards/relatedProduct";

When(
  "{word} store details of {int}. card",
  function (_: string, cardNr: number) {
    homePage.productCards().then((cards) => {
      const card = cards[cardNr - 1];
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

When(
  "{word} store details of {int}. related card",
  function (_: string, cardNr: number) {
    productDetailsPage
      .relatedProducts()
      .eq(cardNr - 1)
      .then(($card) => {
        const relatedCardComp: RelatedProductCard = new RelatedProductCard(
          () => $card
        );

        relatedCardComp
          .image()
          .invoke("attr", "src")
          .then((src: string) => {
            productCardInfo.image.src = src.trim();
          });
        relatedCardComp
          .name()
          .invoke("text")
          .then((text: string) => {
            productCardInfo.name.text = text.trim();
          });
      });
  }
);

When("{word} have {int}. card opened", function (_: string, cardNr: number) {
  homePage.productCards().then((cards) => {
    const card = cards[cardNr - 1];
    cy.spyApi(apis.specificProduct);
    card.name().click();
    productDetailsPage.waitForPage();
  });
});

When(
  "{word} have more info btn of {int}. related product clicked",
  function (_: string, cardNr: number) {
    productDetailsPage
      .relatedProducts()
      .eq(cardNr - 1)
      .then(($card) => {
        const cardComp = new RelatedProductCard(() => $card);
        cy.spyApi(apis.specificProduct);
        cardComp.moreInfo().click();
        productDetailsPage.waitForPage();
      });
  }
);

Then(
  "Product details should be same as in {string}",
  function (cardType: string) {
    productDetailsPage.details
      .image()
      .invoke("attr", "src")
      .should("eq", productCardInfo.image.src);

    productDetailsPage.details
      .name()
      .invoke("text")
      .should("eq", productCardInfo.name.text);

    if (cardType.trim().toLowerCase().match(/price/)) {
      productDetailsPage.details
        .unitPrice()
        .invoke("text")
        .then((text) => {
          expect(`$${text}`).to.eq(productCardInfo.price.text);
        });
    }
  }
);

When("You increase quantity", function () {
  productDetailsPage.details.increaseQuantity().click();
});

When("You decrease quantity", function () {
  productDetailsPage.details.decreaseQuantity().click();
});

Then(
  "{toasterType} toaster {string}",
  function (bddToasterType: ToasterType, bddAssertion: string) {
    const assertion = Factory.getAssertion(bddAssertion);
    if (assertion === "not.exist") {
      Helper.ignoreError("fail", "Expected to find element");
    } else {
      productDetailsPage.getToaster(bddToasterType.type).should(assertion);
    }
  }
);

Given("You programmatically prepare brands data", function () {
  brandsApi.cleanUp();
  brandsApi.setUp();
});

Then(
  "{toasterType} toaster contain(s) text {string}",
  function (bddToasterType: ToasterType, expectedText: string) {
    productDetailsPage
      .getToaster(bddToasterType.type)
      .invoke("text")
      .then((text: string) => {
        expect(text.trim().toLowerCase()).to.contain(expectedText);
      });
  }
);

When(
  "You programmatically have all favourites of {string} deleted",
  function (bddUserName: string) {
    let userToken: string = "";
    // in case there is already logged in user
    if (
      bddUserName
        .trim()
        .toLowerCase()
        .match(/logged(.*)in/)
    ) {
      // use the existing user token
      userToken = window.localStorage.getItem(tokenKeyName);
    }
    // in case No logged in user
    else {
      const userObj = new User(bddUserName);
      // login to generate user token
      loginApi
        .login(userObj.user.EMAIL, userObj.user.PASSWORD)
        .then((loginResp) => {
          userToken = loginResp.body.access_token;
        });
    }

    cy.then(() => {
      favoritesApi.cleanUp(userToken);
      // make sure favorites of this user is deleted
      favoritesApi.get(userToken).then((favoritesResp) => {
        expect(favoritesResp.body).to.be.empty;
      });
    });
  }
);

Then("favorites count is {int}", function (bddFavoritesCount: number) {
  myFavoritesPage.favorites().should("have.length", bddFavoritesCount);
});

Then(
  "For {string} favorite, {string} {string} {string}",
  function (
    bddFavoriteName: string,
    bddFavoriteDetail: string,
    bddAssertion: string,
    expectedValue: string
  ) {
    const chainableFavorites = myFavoritesPage.favorites();
    Base.searchInItems(chainableFavorites, bddFavoriteName).then((index) => {
      myFavoritesPage
        .favorites()
        .eq(index)
        .then(($favorite) => {
          const favoriteComp = new Favorite(() => $favorite);
          const detail = Factory.getFavoriteDetail(
            favoriteComp,
            bddFavoriteDetail
          );
          const assertion = Factory.getAssertion(bddAssertion);

          if (
            bddFavoriteDetail
              .trim()
              .toLowerCase()
              .match(/name|description/)
          ) {
            detail.invoke("text").should(assertion, expectedValue);
          } else if (
            bddFavoriteDetail
              .trim()
              .toLowerCase()
              .match(/delete/)
          ) {
            detail.should(assertion);
          }
        });
    });
  }
);

When(
  "You have card of {string} related product opened",
  function (bddRelatedProductOrder: string) {
    const validBddRelatedProductOrder = Helper.validateBddArrEleOrder(
      bddRelatedProductOrder
    );

    productDetailsPage.relatedProducts().then((relatedProductsJQueryObj) => {
      const relatedProductsArray = relatedProductsJQueryObj.toArray();

      // interpret string bdd order to number
      const bddOrder: number =
        validBddRelatedProductOrder === "any"
          ? Helper.getRandomInteger(1, relatedProductsArray.length)
          : Number(validBddRelatedProductOrder.split(".")[0]);

      cy.spyApi(apis.specificProduct);
      cy.wrap(relatedProductsArray[bddOrder - 1]).click();
      productDetailsPage.waitForPage();
    });
  }
);

Then(
  "product {string} {string} in related products",
  function (bddRelatedProductName: string, bddAssertion: string) {
    const assertion = Factory.getAssertion(bddAssertion);

    // in .feature step, product name has to be passed case-sensitively
    productDetailsPage
      .relatedProducts()
      .filter(`:contains("${bddRelatedProductName}")`)
      .should(assertion);
  }
);
