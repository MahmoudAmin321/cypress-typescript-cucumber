import { adminEndPoint, apis } from "../../support/consts";
import { ApiInfo } from "../../support/models/api";
import { Base } from "../_common/base.pom";

class Categories extends Base {
  readonly relativeUrl = () => `/${adminEndPoint}/categories`;

  readonly storedRowInfo = {
    id: "",
    parentId: "",
    name: "",
    slug: "",
  };

  readonly addCategory = () => cy.get("[data-test=category-add]");
  readonly searchField = () => cy.get("[data-test=category-search-query]");
  readonly searchBtn = () => cy.get("[data-test=category-search-submit]");
  readonly resetBtn = () => cy.get("[data-test=category-search-reset]");

  table = {
    nthRow: (rowNr: number) => cy.get(`tbody > tr:nth-child(${rowNr})`),
    nthId: (rowNr: number) => this.table.nthRow(rowNr).find("td:nth-child(1)"),
    nthParentId: (rowNr: number) =>
      this.table.nthRow(rowNr).find("td:nth-child(2)"),
    nthName: (rowNr: number) =>
      this.table.nthRow(rowNr).find("td:nth-child(3)"),
    nthSlug: (rowNr: number) =>
      this.table.nthRow(rowNr).find("td:nth-child(4)"),

    nthActionBtns: (rowNr: number) => this.nthActionBtns(rowNr),
  };

  getApiInfo(): ApiInfo {
    return apis.categories;
  }

  waitForPage() {
    return cy.wait(`@${apis.categories.interceptorName}`);
  }

  assertPage() {
    cy.url().should("match", new RegExp(`${this.relativeUrl()}$`));

    return this.addCategory().should("be.visible");
  }

  getButton(bddBtnName: string): Cypress.Chainable<any> {
    // Page has No uncommon buttons so far
    return null;
  }
}

const categoriesPage = new Categories();
export default categoriesPage;
