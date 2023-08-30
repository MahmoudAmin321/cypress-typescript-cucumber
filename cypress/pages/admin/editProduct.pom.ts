import { adminEndPoint, apis, dbIdRegex } from "../../support/consts";
import { ApiInfo } from "../../support/models/api";
import { Base } from "../_common/base.pom";

class EditProduct extends Base {
  readonly relativeUrl = (id: string) => `/${adminEndPoint}/users/edit/${id}`;

  readonly textFields = {
    id: () => cy.get("[data-test=id]"),
    name: () => cy.get("[data-test=name]"),
    description: () => cy.get("[data-test=description]"),
    stock: () => cy.get("[data-test=stock]"),
    price: () => cy.get("[data-test=price]"),
  };

  readonly dropdowns = {
    brand: () => cy.get("[data-test=brand-id]"),

    category: () => cy.get("[data-test=category-id]"),

    image: () => cy.get("[data-test=product-image-id]"),
  };

  getApiInfo(): ApiInfo {
    return apis.specificProduct;
  }

  waitForPage() {
    return cy.wait(`@${apis.specificProduct.interceptorName}`);
  }

  assertPage() {
    cy.url().should("match", new RegExp(`${dbIdRegex}$`));

    return this.textFields.id().should("be.visible");
  }

  getButton(bddBtnName: string): Cypress.Chainable<any> {
    // Page has No uncommon buttons so far
    return null;
  }

  getTextField(bddTextFieldName: string) {
    const lower = bddTextFieldName.toLowerCase();
    const textFields = this.textFields;

    if (lower.match(/id$/)) {
      return textFields.id();
    } else if (lower.match(/name/)) {
      return textFields.name();
    } else if (lower.match(/description/)) {
      return textFields.description();
    } else if (lower.match(/stock/)) {
      return textFields.stock();
    } else if (lower.match(/price/)) {
      return textFields.price();
    } else {
      throw Error(
        `Text field [ ${bddTextFieldName} ] doesn't exist in the map`
      );
    }
  }

  getDropdown(bddDropdownName: string) {
    const lower = bddDropdownName.toLowerCase();
    const dropdowns = this.dropdowns;

    if (lower.match(/brand$/)) {
      return dropdowns.brand();
    } else if (lower.match(/categor/)) {
      return dropdowns.category();
    } else if (lower.match(/image/)) {
      return dropdowns.image();
    } else {
      throw Error(`Dropdown [ ${bddDropdownName} ] doesn't exist in the map`);
    }
  }
}

const editProductsPage = new EditProduct();
export default editProductsPage;
