import { adminEndPoint, apis, dbIdRegex } from "../../../support/consts";
import { ApiInfo } from "../../../support/models/api";
import { BaseCategory } from "./baseCategory.pom";

class EditCategory extends BaseCategory {
  readonly relativeUrl = (id: string) =>
    `/${adminEndPoint}/categories/edit/${id}`;

  readonly storedId = "";

  getApiInfo(): ApiInfo {
    return apis.specificCategory;
  }
  waitForPage = () => {
    return cy.wait(`@${apis.specificCategory.interceptorName}`);
  };

  assertPage = () => {
    cy.url().should("match", new RegExp(`${dbIdRegex}$`));
    return this.dropdowns.parentId().should("be.visible");
  };
}

const editCategoryPage = new EditCategory();
export default editCategoryPage;
