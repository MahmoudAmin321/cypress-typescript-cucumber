import { apis } from "../support/consts";
import { ApiInfo } from "../support/models/api";
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

  readonly successToaster = () => cy.get("app-toasts [class*=success]");

  getApiInfo(): ApiInfo {
    return apis.specificProduct;
  }

  waitForPage() {
    return cy.wait(`@${apis.specificProduct.interceptorName}`);
  }

  getButton(bddBtnName: string): Cypress.Chainable<any> {
    if (bddBtnName.toLowerCase().match(/cart/)) {
      return this.details.addToCartBtn();
    } else if (bddBtnName.toLowerCase().match(/favo/)) {
      return this.details.addToFavoritesBtn();
    } else {
      throw Error(`Button [ ${bddBtnName} ] doesn't exist in the map`);
    }
  }
}

const productDetailsPage = new ProductDetails();
export default productDetailsPage;
