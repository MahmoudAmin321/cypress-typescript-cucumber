import { apis } from "../../../../support/consts";
import { apiHost } from "../../../../support/cyEnvVar";

class RegisterApi {
  registrationData = {
    first_name: "test",
    last_name: "Doe",
    address: "Street 1",
    city: "City",
    state: "State",
    country: "Country",
    postcode: "1234AA",
    phone: "0987654321",
    dob: "1970-01-01",
    email: "test11@test.test",
    password: "welcome01",
  };

  register(reqBody: object): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.register.relativeUrl()}`,
      method: "POST",
      body: reqBody,
      failOnStatusCode: false,
    });
  }
}

const registerApi = new RegisterApi();
export default registerApi;
