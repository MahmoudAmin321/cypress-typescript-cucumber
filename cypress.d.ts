import { ApiInfo, stubApiArgs } from "./cypress/support/models/api";
import { UserInfo } from "./cypress/support/models/userInfo";

// Reference: https://docs.cypress.io/guides/tooling/typescript-support#Using-an-External-Typings-File
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to intercept api and create alias for the interception
       * @param api
       * @param method HTTP request method. Default is "GET"
       * @param times Maximum number of times to intercept the request. Default is 1
       * @example cy.spyApi()
       */
      spyApi(api: ApiInfo, method?: string, times?: number): Chainable<any>;

      stubApi({
        api,
        method = "GET",
        times = 1,
        statusCode = 200,
        resBody,
      }: stubApiArgs): Chainable<any>;

      loginWithUI(user: UserInfo): Chainable<any>;

      loginProgrammatically(user: UserInfo): Chainable<any>;
    }
  }
}
