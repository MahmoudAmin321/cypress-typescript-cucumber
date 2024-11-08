import { adminEndPoint } from "../../../support/consts";
import { BaseCategory } from "./baseCategory.pom";

class AddCategory extends BaseCategory {
  readonly relativeUrl = () => `/${adminEndPoint}/categories/add`;

  assertPage() {
    cy.url().should("match", /add$/);
    return this.dropdowns.parentId().should("be.visible");
  }
}

const addCategoryPage = new AddCategory();
export default addCategoryPage;
