import { apis } from "../../support/consts";
import { Helper } from "../../support/helper";
import categoriesApi from "../_common/apiPom/category/categoriesApi";

describe(`${apis.categories.relativeUrl()}`, () => {
  before(() => {
    categoriesApi.cleanUp();
  });

  beforeEach(() => {
    // TODO .. when POST categories
    // brandsApi.setUp();
  });

  afterEach(() => {
    categoriesApi.cleanUp();
  });

  after(() => {
    cy.log("after all tests in this suite");
  });

  it("Should GET categories successfully", () => {
    categoriesApi.get().then((categoriessResp) => {
      expect(categoriessResp.status).to.eq(200);
      expect(categoriessResp.body).to.be.an("array").and.not.to.be.empty;

      // Assert, that any (randomly selected) object in the response array has the correct properties
      const randomIndex = Helper.getRandomInteger(
        0,
        categoriessResp.body.length - 1,
      );

      const objectTepmlate = {
        ...categoriesApi.categoryData(),
        id: "", // dummy value
        parent_id: "", // dummy value
      };
      expect(categoriessResp.body[randomIndex])
        .to.be.an("object")
        .and.to.include.all.keys(objectTepmlate);
    });
  });

  it("Should return 405, when the request method is not allowed (i.e. DELETE)", () => {
    categoriesApi.get(categoriesApi.url, "DELETE").then((categoriessResp) => {
      expect(categoriessResp.status).to.eq(405);
      expect(categoriessResp.body.message).to.include("not allowed");
    });
  });

  it("Should return 404, when the requested resource is Not found", () => {
    categoriesApi.get(categoriesApi.url + "Invalid").then((categoriessResp) => {
      expect(categoriessResp.status).to.eq(404);
    });
  });

  // TODO .. when POST categories
  // should throw error if unauthorized user calls the api

  // TODO .. when POST categories
  // it("Should POST brand successfully, upon providing valid body", () => {
  //   const brandData = brandApi.brandData();
  //   brandsApi.post(brandData).then((brandResp) => {
  //     expect(brandResp.status).to.eq(201);
  //     expect(brandResp.body.id).to.be.a("string").and.to.be.ok; // ok refers to "truthy"

  //     // Make sure, the generated id is unique
  //     /// get all brands
  //     categoriesApi.get().then((categoriessResp) => {
  //       /// search for id in brands
  //       const count = brandsApi.searchInBrands(
  //         brandResp.body.id,
  //         categoriessResp.body
  //       );
  //       /// expect id occurrences to be 1
  //       expect(count).to.eq(1);
  //     });

  //     // Assert name and slug
  //     expect(brandResp.body.name).to.eq(brandData.name);
  //     expect(brandResp.body.slug).to.eq(brandData.slug);
  //   });
  // });

  // it("adding non-existing property to body doesn't affect creating a new brand", () => {
  //   const brandDataExtra = { ...brandApi.brandData(), extra: "extra property" };
  //   brandsApi.createNewBrand(brandDataExtra);
  // });

  // it("Should succeed upon trying to create a brand with same name as an existing brand, but non-existing slug ", () => {
  //   // precondition: create new brand
  //   brandsApi.createNewBrand();

  //   cy.then(() => {
  //     // non-existing slug
  //     const brandData = {
  //       name: brandApi.brandData().name,
  //       slug: brandApi.brandData().slug + "123",
  //     };
  //     brandsApi.createNewBrand(brandData);
  //   });
  // });

  // describe(`Should return 422 with correct error msg, upon providing invalid body, when POST a brand`, () => {
  //   it("already existing slug", () => {
  //     categoriesApi.get().then((getResp) => {
  //       const existingSlug = getResp.body[0].slug;
  //       const brandData = {
  //         name: brandApi.brandData().name,
  //         slug: existingSlug,
  //       };

  //       brandsApi.post(brandData).then((postResp) => {
  //         expect(postResp.status).to.eq(422);
  //         expect(postResp.body.slug[0]).to.match(
  //           /brand(.*)already exist(.*)slug/
  //         );
  //       });
  //     });
  //   });

  //   it("invalid slug", () => {
  //     const invalidSlug = "";
  //     const brandData = { name: brandApi.brandData().name, slug: invalidSlug };

  //     brandsApi.post(brandData).then((brandResp) => {
  //       expect(brandResp.status).to.eq(422);
  //       expect(brandResp.body.slug[0]).to.match(/slug (.*)is required/);
  //     });
  //   });

  //   it("same as existing slug, but different casing", () => {
  //     // precondition: create new brand
  //     brandsApi.createNewBrand();

  //     cy.then(() => {
  //       // same as existing slug, but different casing
  //       const brandData = brandApi.brandData(brandApi.brandName.toUpperCase());
  //       brandsApi.post(brandData).then((brandResp) => {
  //         expect(brandResp.status).to.eq(422);
  //       });
  //     });
  //   });

  //   it("invalid name", () => {
  //     const invalidName = "       ";
  //     const brandData = {
  //       name: invalidName,
  //       slug: brandApi.brandData().slug,
  //     };
  //     brandsApi.post(brandData).then((brandResp) => {
  //       expect(brandResp.status).to.eq(422);
  //       expect(brandResp.body.name[0]).to.match(/name (.*)is required/);
  //     });
  //   });

  //   it("removing existing property from body", () => {
  //     const brandData = brandApi.brandData();
  //     delete brandData.name;
  //     brandsApi.post(brandData).then((brandResp) => {
  //       expect(brandResp.status).to.eq(422);
  //       expect(brandResp.body.name[0]).to.match(/name (.*)is required/);
  //     });
  //   });
  // });
});
