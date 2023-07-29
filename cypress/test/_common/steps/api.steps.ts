import { When } from "@badeball/cypress-cucumber-preprocessor";
import { apisFactory } from "../../../support/models/api";

/* As cucumber is meant to hide technicalities from business stakeholders, steps like these are anti-pattern because
they expose technicalities in the feature file. Use them only if there is really No other option
*/

When("{word} spy {string} api", function (_: string, bddApiName: string) {
  const api = apisFactory.getApi(bddApiName);
  cy.spyApi(api);
});

When("{word} wait for {string} api", function (_: string, bddApiName: string) {
  const api = apisFactory.getApi(bddApiName);
  cy.wait(`@${api.interceptorName}`);
});
