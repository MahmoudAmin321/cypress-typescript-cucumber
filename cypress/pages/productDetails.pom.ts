import { apis } from "../support/consts";
import { ApiInfo } from "../support/models/api";
import { toastType } from "../support/models/toaterType";
import { Base } from "./_common/base.pom";

class ProductDetails extends Base {
  readonly relativeUrl = (id: string) => `/product/${id}`;

  storedId: string;

  readonly details = {
    container: () => cy.get("[class*='row my']"),
    image: () => this.details.container().find("img"),
    name: () => this.details.container().find("[data-test=product-name]"),
    category: () =>
      this.details.container().find("[class^='badge rounded-pill']").eq(0),
    brand: () =>
      this.details.container().find("[class^='badge rounded-pill']").eq(1),
    description: () =>
      this.details.container().find("[data-test=product-description]"),
    unitPrice: () => this.details.container().find("[data-test=unit-price]"),
    increaseQuantity: () =>
      this.details.container().find("[data-test=increase-quantity]"),
    decreaseQuantity: () =>
      this.details.container().find("[data-test=decrease-quantity]"),
    quantity: () => this.details.container().find("[data-test=quantity]"),
    addToCartBtn: () =>
      this.details.container().find("[data-test=add-to-cart]"),
    addToFavoritesBtn: () =>
      this.details.container().find("[data-test=add-to-favorites]"),
  };

  readonly relatedProducts = () => cy.get("[class='card'][href*='product/']");

  readonly toasters = {
    container: () => cy.get("[id=toast-container]"),
    success: () => this.toasters.container().find("[class*=success]"),
    failure: () => this.toasters.container().find("[class*=error]"),
  };

  getApiInfo(): ApiInfo {
    return apis.specificProduct;
  }

  waitForPage() {
    return cy.wait(`@${apis.specificProduct.interceptorName}`);
  }

  getButton(bddBtnName: string) {
    return null;
  }

  getButtonAndItsAssociations(bddBtnName: string) {
    if (bddBtnName.toLowerCase().match(/cart/)) {
      return {
        spy: () => cy.spyApi(apis.specificCart, "POST"),
        btn: this.details.addToCartBtn,
        wait: () => cy.wait(`@${apis.specificCart.interceptorName}`),
      };
    } else if (bddBtnName.toLowerCase().match(/favo/)) {
      return {
        spy: () => cy.spyApi(apis.favorites, "POST"),
        btn: this.details.addToFavoritesBtn,
        wait: () => cy.wait(`@${apis.favorites.interceptorName}`),
      };
    } else {
      throw Error(`Button [ ${bddBtnName} ] doesn't exist in the map`);
    }
  }

  getToaster(toasterPropertyName: toastType): Cypress.Chainable<any> {
    return this.toasters[toasterPropertyName]();
  }
}

const productDetailsPage = new ProductDetails();
export default productDetailsPage;
