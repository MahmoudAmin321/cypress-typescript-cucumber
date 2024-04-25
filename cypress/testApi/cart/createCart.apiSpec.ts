import { apis } from "../../support/consts";
import { apiHost } from "../../support/cyEnvVar";
import cartApi from "../_common/apiPom/cart/cartApi";
import cartsApi from "../_common/apiPom/cart/cartsApi";

describe("testttttt", () => {
  before(() => {
    cy.log("before all tests in this suite");
  });

  beforeEach(() => {
    // delete stored carts
    cartApi.setUp();
  });

  afterEach(() => {
    cy.log("after each test in this suite");
  });

  after(() => {
    cy.log("after all tests in this suite");
  });

  it("should create cart successfully", () => {
    cartsApi.createAndStoreCart().then((postCartResp) => {
      expect(postCartResp.isOkStatusCode).to.eq(true);
    });

    cartsApi.createAndStoreCart();
    cartsApi.createAndStoreCart();
  });

  it("should return method Not allowed, if unsupported method is passed", () => {
    cy.request({
      url: `${apiHost}${apis.carts.relativeUrl()}`,
      method: "GET",
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(405);
      expect(resp.body.message).to.include("not allowed");
    });
  });
});
