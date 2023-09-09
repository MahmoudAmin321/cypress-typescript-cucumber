import { Then, When } from "@badeball/cypress-cucumber-preprocessor";
import entitiesFactory from "../../../pages/admin/entitiesFactory";
import { apis } from "../../../support/consts";
import { Helper } from "../../../support/helper";
import { Base } from "../../../pages/_common/base.pom";

When(
  "{word} have clicked on {string} button of {int}. {string}",
  function (_: string, bddActionBtn: string, rowNr: number, bddEntity: string) {
    const table = entitiesFactory.getEntity(bddEntity).table;
    const lower = bddActionBtn.toLowerCase();

    if (lower.match(/edit/)) {
      // spy
      cy.spyApi(apis.specificProduct);

      // click
      table.nthActionBtns(rowNr).edit().click();

      // wait
      cy.wait(`@${apis.specificProduct.interceptorName}`);
    } else if (lower.match(/delete/)) {
      // spy
      cy.spyApi(apis.products);

      // click
      table.nthActionBtns(rowNr).delete().click();

      // wait
      cy.wait(`@${apis.products.interceptorName}`);
    } else {
      throw Error(`Button [ ${bddActionBtn} ] doesn't exist in the map`);
    }
  }
);

// Unused yet
When(
  "{word} store {string} of {int}. {string}",
  function (
    _: string,
    bddColumnName: string,
    rowNr: number,
    bddEntity: string
  ) {
    // get from DOM
    const column = entitiesFactory.getColumnFromDOM(
      bddColumnName,
      bddEntity,
      rowNr
    );
    column.invoke("text").then((text) => {
      // store
      const columnSetter = entitiesFactory.getColumnSetter(
        bddColumnName,
        bddEntity
      );
      columnSetter(text);
    });
  }
);

When("{word} have saved", function (_: string) {
  // spy api
  cy.spyApi(apis.specificProduct, "PUT");

  // save
  Base.saveBtn().click();

  // wait for api
  cy.wait(`@${apis.specificProduct.interceptorName}`);
});

// Unused yet
Then(
  "{string} of {int}. {string} {string} {string}",
  function (
    bddColumnName: string,
    rowNr: number,
    bddEntity: string,
    bddAssertion: string,
    bddText: string
  ) {
    let expectedText: string;
    if (bddText.toLowerCase().match(/as stored/)) {
      expectedText = entitiesFactory.getStoredColumn(bddColumnName, bddEntity);
      console.log("exp ", expectedText);
    } else {
      expectedText = bddText;
    }

    const column = entitiesFactory.getColumnFromDOM(
      bddColumnName,
      bddEntity,
      rowNr
    );
    const assertion = Helper.getAssertion(bddAssertion);
    column.invoke("text").then((text) => {
      const trimmedText = text.trim();
      cy.wrap(trimmedText).should(`${assertion}equal`, expectedText);
    });
  }
);
