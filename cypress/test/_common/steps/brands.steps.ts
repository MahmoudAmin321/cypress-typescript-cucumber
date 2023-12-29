import { When } from "@badeball/cypress-cucumber-preprocessor";
import { apis } from "../../../support/consts";
import checkBoxAction from "../../../support/models/checboxAction";
import { Base } from "../../../pages/_common/base.pom";
import brandsSearchApi from "../../../testApi/_common/apiPom/brand/brandsSearchApi";

When(
  "You have {string} {string} brand",
  function (cBoxAction: string, bddBrandName: string) {
    let id: string = "undefined id";
    brandsSearchApi.search(bddBrandName.trim()).then((brandsSearchResp) => {
      const searchResult = brandsSearchResp.body;
      expect(searchResult).to.be.an("array");
      expect(searchResult.length).to.eq(1);

      id = searchResult[0].id;
    });

    cy.spyApi(apis.products);

    cy.then(() => {
      const chainableCheckBox = Base.specificBrand(id);
      checkBoxAction.perform(cBoxAction, chainableCheckBox);
    });

    cy.wait(`@${apis.products.interceptorName}`);
  }
);
