import { apis, dbIdRegex } from "../../support/consts";
import { apiHost } from "../../support/cyEnvVar";
import { Helper } from "../../support/helper";
import imagesApi from "../_common/apiPom/image/imageApi";

describe(`${apis.images.relativeUrl()}`, () => {
  before(() => {
    cy.log(`local (images) before all of mocha`);
  });

  beforeEach(() => {
    cy.log(`local (images) beforeEach of mocha`);
  });

  afterEach(() => {
    cy.log(`local (images) afterEach of mocha`);
  });

  after(() => {
    cy.log(`local (images) after all of mocha`);
  });

  it("should get images successfully", () => {
    imagesApi.get().then((imagesResp) => {
      expect(imagesResp.body).to.be.an("array").and.not.to.be.empty;
      const imageKeys = {
        id: "",
        by_name: "",
        by_url: "",
        source_name: "",
        source_url: "",
        file_name: "",
        title: "",
      };
      // Assert, that any (randomly selected) object in the response array has the correct properties
      const randomIndex = Helper.getRandomInteger(
        0,
        imagesResp.body.length - 1
      );
      expect(imagesResp.body[randomIndex])
        .to.be.an("object")
        .and.to.include.all.keys(imageKeys);
      expect(imagesResp.body[randomIndex].id).to.match(new RegExp(dbIdRegex));
    });
  });

  it("should return Not found if invalid url is provided", () => {
    imagesApi
      .get(`${imagesApi.url}INVALID`)
      .then((imagesResp) => {
        const respMsg = imagesResp.body.message.toLowerCase();
        expect(imagesResp.status).to.equal(404);
        expect(respMsg).to.contain("not found");
      });
  });

  it("should return method Not allowed if request method is other than GET", () => {
    imagesApi.get(imagesApi.url, "POST").then((imagesResp) => {
        const respMsg = imagesResp.body.message.trim().toLowerCase();
        expect(imagesResp.status).to.equal(405);
        expect(respMsg).to.contain("method is not allowed");
      });
  });
});
