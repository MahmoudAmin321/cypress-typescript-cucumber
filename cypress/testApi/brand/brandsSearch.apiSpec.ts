import { apis, tokenAliasName, users } from "../../support/consts";
import brandApi from "../_common/apiPom/brand/brandApi";
import brandsApi from "../_common/apiPom/brand/brandsApi";
import brandsSearchApi from "../_common/apiPom/brand/brandsSearchApi";

describe(`${apis.brandsSearch.relativeUrl()}`, () => {
  before(() => {
    brandsApi.cleanUp();
  });

  beforeEach(() => {
    brandsApi.setUp();
  });

  afterEach(() => {
    brandsApi.cleanUp();
  });

  after(() => {
    cy.log("after all tests in this suite");
  });

  it("Should search by brand name", () => {
    // precondition: create multiple brands
    const brandName = "is a brand name";
    let brandData = {
      name: brandName,
      slug: `${brandName.toLowerCase().replace(/ /g, "-")}-1`,
    };
    brandsApi.createNewBrand(brandData);

    cy.then(() => {
      brandData = {
        name: brandName,
        slug: `${brandName.toLowerCase().replace(/ /g, "-")}-2`,
      };
      brandsApi.createNewBrand(brandData);
    });

    brandsSearchApi.search(brandName).then((brandsSearchResp) => {
      expect(brandsSearchResp.status).equal(200);
      expect(brandsSearchResp.body).to.be.an("array");
      expect(brandsSearchResp.body.length).to.eq(2);
      expect(brandsSearchResp.body[0].name).to.eq(brandName);
      expect(brandsSearchResp.body[1].name).to.eq(brandName);
    });
  });

  it("Should return No data, if search value doesn't exist", () => {
    const nonExitingName = "doesn't exist";

    brandsSearchApi.search(nonExitingName).then((usersSearchResp) => {
      expect(usersSearchResp.status).equal(200);
      expect(usersSearchResp.body).deep.eq([]);
    });
  });

  it("Search should be case-insensitive", () => {
    // precondition: create brand
    const brandName = "is a brand name";
    const brandData = brandApi.brandData(brandName);
    brandsApi.createNewBrand(brandData);

    brandsSearchApi.search(brandName).then((usersSearchResp) => {
      expect(usersSearchResp.status).equal(200);
      expect(usersSearchResp.body.length).to.eq(1);
      expect(usersSearchResp.body[0].name).to.eq(brandName);
    });
  });

  it("Search should allow starts with", () => {
    // precondition: create brand
    const brandName = "is a brand name";
    const brandData = brandApi.brandData(brandName);
    brandsApi.createNewBrand(brandData);

    brandsSearchApi
      .search(brandName.substring(0, brandName.length - 3))
      .then((usersSearchResp) => {
        expect(usersSearchResp.status).equal(200);
        expect(usersSearchResp.body.length).to.eq(1);
        expect(usersSearchResp.body[0].name).to.eq(brandName);
      });
  });

  it("Search should allow contains", () => {
    // precondition: create brand
    const brandName = "is a brand name";
    const brandData = brandApi.brandData(brandName);
    brandsApi.createNewBrand(brandData);

    brandsSearchApi.search(brandName.substring(3)).then((usersSearchResp) => {
      expect(usersSearchResp.status).equal(200);
      expect(usersSearchResp.body.length).to.eq(1);
      expect(usersSearchResp.body[0].name).to.eq(brandName);
    });
  });

  it("Should return No data, if part of the search value exists", () => {
    // i.e. brand name is "is brand" and search value is "This is brand x"
    const brandName = "is brand";
    const searchValue = `this ${brandName} x`;

    // precondition: create brand
    const brandData = brandApi.brandData(brandName);
    brandsApi.createNewBrand(brandData);

    brandsSearchApi.search(searchValue).then((usersSearchResp) => {
      expect(usersSearchResp.status).equal(200);
      expect(usersSearchResp.body).to.deep.eq([]);
    });
  });

  it("Should return No data, upon searching for other value than brand name", () => {
    // precondition: create brand
    const brandName = "is a brand name";
    const brandData = brandApi.brandData(brandName);
    brandsApi.createNewBrand(brandData);

    brandsSearchApi
      .search(brandData.slug) // search value is slug instead of name
      .then((usersSearchResp) => {
        expect(usersSearchResp.status).equal(200);
        expect(usersSearchResp.body).deep.eq([]);
      });
  });

  it.only("Should find brand name normally, if it contains special characters", () => {
    // precondition: create brand
    const brandName = "a';- &!(),.\" name";
    const brandData = brandApi.brandData(brandName);
    brandsApi.createNewBrand(brandData);

    brandsSearchApi.search(brandName).then((usersSearchResp) => {
      expect(usersSearchResp.status).to.equal(200);
      expect(usersSearchResp.body.length).to.equal(1);
      expect(usersSearchResp.body[0].name).to.deep.equal(brandName);
    });
  });
});
