import { adminEndPoint, apis } from "../../support/consts";
import { ApiInfo } from "../../support/models/api";
import { Base } from "../_common/base.pom";

class Products extends Base {
  readonly relativeUrl = () => `/${adminEndPoint}/products`;

  readonly storedRowInfo = {
    id: "",
    name: "",
    stock: "",
    price: "",
  };

  readonly addProduct = () => cy.get("[data-test=product-add]");

  table = {
    nthRow: (rowNr: number) => cy.get(`tbody > tr:nth-child(${rowNr})`),
    nthId: (rowNr: number) => this.table.nthRow(rowNr).find("td:nth-child(1)"),
    nthName: (rowNr: number) =>
      this.table.nthRow(rowNr).find("td:nth-child(2)"),
    nthStock: (rowNr: number) =>
      this.table.nthRow(rowNr).find("td:nth-child(3)"),
    nthPrice: (rowNr: number) =>
      this.table.nthRow(rowNr).find("td:nth-child(4)"),

    nthActionBtns: (rowNr: number) => this.nthActionBtns(rowNr),
  };

  getApiInfo(): ApiInfo {
    return apis.products;
  }

  waitForPage() {
    return cy.wait(`@${apis.products.interceptorName}`);
  }

  assertPage() {
    cy.url().should("match", new RegExp(`${this.relativeUrl()}$`));

    return this.addProduct().should("be.visible");
  }

  getButton(bddBtnName: string): Cypress.Chainable<any> {
    // Page has No uncommon buttons so far
    return null;
  }
}

const productsPage = new Products();
export default productsPage;
