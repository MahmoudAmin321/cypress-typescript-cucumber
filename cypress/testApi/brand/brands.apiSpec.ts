import { apis } from "../../support/consts";
import { Helper } from "../../support/helper";
import brandApi from "../_common/apiPom/brand/brandApi";
import brandsApi from "../_common/apiPom/brand/brandsApi";

describe(`${apis.brands.relativeUrl()}`, () => {
  before(() => {
    cy.log("before all tests in this suite");
  });

  beforeEach(() => {
    brandApi.resetBrandData();
    brandsApi.cleanUp();
    brandsApi.setUp();
  });

  afterEach(() => {
    brandApi.resetBrandData();
  });

  after(() => {
    brandsApi.cleanUp();
    brandsApi.setUp();
  });

  it("Should GET brands successfully", () => {
    brandsApi.requestBrands().then((brandsResp) => {
      expect(brandsResp.status).to.eq(200);
      expect(brandsResp.body).to.be.an("array").and.not.to.be.empty;

      // Assert, that any (randomly selected) object in the response array has the correct properties
      const randomIndex = Helper.getRandomInteger(
        0,
        brandsResp.body.length - 1
      );
      expect(brandsResp.body[randomIndex])
        .to.be.an("object")
        .and.to.include.all.keys(brandApi.brandData);
    });
  });

  it("Should return 405, when the request method is not allowed (i.e. DELETE)", () => {
    brandsApi.requestBrands("DELETE").then((brandsResp) => {
      expect(brandsResp.status).to.eq(405);
      expect(brandsResp.body.message).to.include("not allowed");
    });
  });

  it("Should return 404, when the requested resource is Not found", () => {
    brandsApi.requestBrands("GET", "/brandsInvalid").then((brandsResp) => {
      expect(brandsResp.status).to.eq(404);
    });
  });

  it("Should POST brand successfully, upon providing valid body", () => {
    brandApi.post(brandApi.brandData).then((brandResp) => {
      expect(brandResp.status).to.eq(201);
      expect(brandResp.body.id).to.be.a("string").and.to.be.ok; // ok refers to "truthy"

      // Make sure, the generated id is unique
      /// get all brands
      brandsApi.requestBrands().then((brandsResp) => {
        /// search for id in brands
        const count = brandsApi.searchBrands(
          brandResp.body.id,
          brandsResp.body
        );
        /// expect id occurrences to be 1
        expect(count).to.eq(1);
      });

      // Assert name and slug
      expect(brandResp.body.name).to.eq(brandApi.brandData.name);
      expect(brandResp.body.slug).to.eq(brandApi.brandData.slug);
    });
  });

  it("adding non-existing property to body doesn't affect creating a new brand", () => {
    brandApi.brandData["extra"] = "extra property";
    brandApi.create();
  });

  describe(`Should return 422 with correct error msg, upon providing invalid body, when POST a brand`, () => {
    it("already existing slug", () => {
      brandsApi.requestBrands().then((getResp) => {
        const existingSlug = getResp.body[0].slug;
        brandApi.brandData.slug = existingSlug;
        brandApi.post(brandApi.brandData).then((postResp) => {
          expect(postResp.status).to.eq(422);
          expect(postResp.body.slug[0]).to.match(
            /brand(.*)already exist(.*)slug/
          );
        });
      });
    });

    it("invalid slug", () => {
      const invalidSlug = ""
      brandApi.brandData.slug = invalidSlug;
      brandApi.post(brandApi.brandData).then((brandResp) => {
        expect(brandResp.status).to.eq(422);
        expect(brandResp.body.slug[0]).to.match(/slug (.*)is required/);
      });
    });

    it("invalid name", () => {
      const invalidName = "       "
      brandApi.brandData.name = invalidName;
      brandApi.post(brandApi.brandData).then((brandResp) => {
        expect(brandResp.status).to.eq(422);
        expect(brandResp.body.name[0]).to.match(/name (.*)is required/);
      });
    });

    it("removing existing property from body", () => {
      delete brandApi.brandData.name;
      brandApi.post(brandApi.brandData).then((brandResp) => {
        expect(brandResp.status).to.eq(422);
        expect(brandResp.body.name[0]).to.match(/name (.*)is required/);
      });
    });
  });
});
