import { apis, tokenAliasName, users } from "../../support/consts";
import { apiHost } from "../../support/cyEnvVar";
import brandApi from "../_common/apiPom/brand/brandApi";
import brandsApi from "../_common/apiPom/brand/brandsApi";
import productApi from "../_common/apiPom/product/productApi";
import productsApi from "../_common/apiPom/product/productsApi";
import loginApi from "../_common/apiPom/user/loginApi";

describe(`${apis.specificBrand.relativeUrl("{brandId}")}`, () => {
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

  describe("GET brand", () => {
    it("Should get brand by id", () => {
      // Precondition: create new brand
      brandsApi.createNewBrand().then((brandInfo) => {
        // get brand by id
        brandApi.get(brandInfo.id).then((brandResp) => {
          // assert
          expect(brandResp.status).to.eq(200);
          expect(brandResp.body.id).to.eq(brandInfo.id);
          expect(brandResp.body.name).to.eq(brandInfo.name);
          expect(brandResp.body.slug).to.eq(brandApi.brandData().slug);
        });
      });
    });

    it("Should return not found, if non-existing brand id is provided", () => {
      const nonExistingBrandId = "xyz123";
      brandApi.get(nonExistingBrandId).then((brandResp) => {
        const respMsg = brandResp.body.message.toLowerCase();
        expect(brandResp.status).to.equal(404);
        expect(respMsg).to.contain("not found");
      });
    });
  });

  describe("PUT brand", () => {
    it("Should update brand, if valid data is provided", () => {
      // Precondition: Create new brand
      brandsApi.createNewBrand().then((brandInfo) => {
        // prepare PUT request body (New brand data)
        const brandName = brandApi.brandName + " updated";
        const brandData = brandApi.brandData(brandName);

        // update brand
        brandApi.update(brandInfo.id, brandData).then((updateBrandResp) => {
          expect(updateBrandResp.status).to.eq(200);
          expect(updateBrandResp.body.success).to.eq(true);
        });
        // assert brand is updated correctly
        brandApi.get(brandInfo.id).then((getBrandResp) => {
          const excludedKeys = ["id"];
          for (const key in getBrandResp.body) {
            // skip properties, that don't exist in both objects
            if (excludedKeys.includes(key)) {
              continue;
            }

            expect(getBrandResp.body[key]).to.equal(brandData[key]);
          }
        });
      });
    });

    describe("Updating a single property in brand should Not remove the other properties", () => {
      it("Update name only without slug", () => {
        // Precondition: create new brand
        brandsApi.createNewBrand().then((brandInfo) => {
          const brandName = brandApi.brandName + " updated";
          const brandData = brandApi.brandData(brandName);
          delete brandData["slug"];

          // update
          brandApi.update(brandInfo.id, brandData).then((updateBrandResp) => {
            expect(updateBrandResp.status).to.eq(200);
            expect(updateBrandResp.body.success).to.eq(true);

            brandApi.get(brandInfo.id).then((getBrandResp) => {
              // Assert, slug didn't get removed
              expect(getBrandResp.body.slug).to.be.ok.and.to.equal(
                brandInfo.slug
              );

              // Assert, name is updated correctly
              expect(getBrandResp.body.name).to.equal(brandData.name);
            });
          });
        });
      });

      it("Update slug only without name", () => {
        // Precondition: create new brand
        brandsApi.createNewBrand().then((brandInfo) => {
          const brandName = brandApi.brandName + " updated";
          const brandData = brandApi.brandData(brandName);
          delete brandData["name"];

          // update
          brandApi.update(brandInfo.id, brandData).then((updateBrandResp) => {
            expect(updateBrandResp.status).to.eq(200);
            expect(updateBrandResp.body.success).to.eq(true);

            brandApi.get(brandInfo.id).then((getBrandResp) => {
              // Assert, name didn't get removed
              expect(getBrandResp.body.name).to.be.ok.and.to.equal(
                brandInfo.name
              );

              // Assert, slug is updated correctly
              expect(getBrandResp.body.slug).to.equal(brandData.slug);
            });
          });
        });
      });
    });

    it("Update brand should fail, if the new slug already exists", () => {
      // Precondition: Create new brand 111
      const brandName111 = brandApi.brandName + " 111";
      const brandData111 = brandApi.brandData(brandName111);
      brandsApi.createNewBrand(brandData111).then((brand111Info) => {
        // Precondition: Create new brand 222
        const brandName222 = brandApi.brandName + " 222";
        const brandData222 = brandApi.brandData(brandName222);
        brandsApi.createNewBrand(brandData222).then((brand222Info) => {
          // update brand 111 with slug of brand 222
          const updatedBrandData = {
            name: brandApi.brandData().name,
            slug: brand222Info.slug,
          };
          brandApi
            .update(brand111Info.id, updatedBrandData)
            .then((updateBrandResp) => {
              expect(updateBrandResp.status).to.eq(422);
              expect(updateBrandResp.body.message.toLowerCase()).to.eq(
                "duplicate entry"
              );
            });
        });
      });
    });

    it("Should fail upon trying to update a brand with same slug as another existing brand, but different casing", () => {
      // Precondition: Create new brand 111
      const brandName111 = brandApi.brandName + " 111";
      const brandData111 = brandApi.brandData(brandName111);
      brandsApi.createNewBrand(brandData111).then((brand111Info) => {
        // Precondition: Create new brand 222
        const brandName222 = brandApi.brandName + " 222";
        const brandData222 = brandApi.brandData(brandName222);
        brandsApi.createNewBrand(brandData222).then((brand222Info) => {
          // update brand 111 with slug of brand 222, but different casing
          const updatedBrandData = {
            name: brandApi.brandData().name,
            slug: brand222Info.slug.toUpperCase(),
          };
          brandApi
            .update(brand111Info.id, updatedBrandData)
            .then((updateBrandResp) => {
              expect(updateBrandResp.status).to.eq(422);
              expect(updateBrandResp.body.message.toLowerCase()).to.eq(
                "duplicate entry"
              );
            });
        });
      });
    });

    it("Update brand should be successful, if the new name already exists", () => {
      // Precondition: Create new brand 111
      const brandName111 = brandApi.brandName + " 111";
      const brandData111 = brandApi.brandData(brandName111);
      brandsApi.createNewBrand(brandData111).then((brand111Info) => {
        // Precondition: Create new brand 222
        const brandName222 = brandApi.brandName + " 222";
        const brandData222 = brandApi.brandData(brandName222);
        brandsApi.createNewBrand(brandData222).then((brand222Info) => {
          // update brand 111 with name of brand 222
          const updatedBrandData = {
            name: brand222Info.name,
            slug: brandApi.brandData().slug,
          };
          brandApi
            .update(brand111Info.id, updatedBrandData)
            .then((updateBrandResp) => {
              expect(updateBrandResp.status).to.eq(200);
              expect(updateBrandResp.body.success).to.eq(true);
            });
        });
      });
    });

    describe("Update brand should fail, if invalid data is provided", () => {
      it("name is Not string (i.e. number)", () => {
        // Precondition: create new brand
        brandsApi.createNewBrand().then((brandInfo) => {
          const invalidName = 123;
          const reqBody = { name: invalidName, slug: "valid slug" };
          // update
          brandApi.update(brandInfo.id, reqBody).then((brandResp) => {
            expect(brandResp.status).to.eq(422);
            expect(brandResp.body.name[0].toLowerCase()).to.match(
              /name(.*)must be(.*)string/
            );
          });
        });
      });

      it("slug is Not string (i.e. number)", () => {
        // Precondition: create new brand
        brandsApi.createNewBrand().then((brandInfo) => {
          const invalidSlug = 123;
          const reqBody = { name: "valid name", slug: invalidSlug };
          // update
          brandApi.update(brandInfo.id, reqBody).then((brandResp) => {
            expect(brandResp.status).to.eq(422);
            expect(brandResp.body.slug[0].toLowerCase()).to.match(
              /slug(.*)must be(.*)string/
            );
          });
        });
      });
    });
  });

  describe("DELETE brand", () => {
    beforeEach(() => {
      loginApi
        .login(users.admin.EMAIL, users.admin.PASSWORD)
        .then((loginResp) => {
          // store token
          cy.wrap(loginResp.body.access_token).as(tokenAliasName);
        });
    });

    it("Should delete brand, if valid brand id is provided and this brand is Not in use", () => {
      // Precondition: create new brand
      brandsApi.createNewBrand().then((brandInfo) => {
        // delete
        cy.get(`@${tokenAliasName}`).then((token: any) => {
          brandApi.delete(brandInfo.id, token).then((deleteBrandResp) => {
            expect(deleteBrandResp.status).to.eq(204);
            // Assert, brand is deleted
            brandApi.get(brandInfo.id).then((getBrandResp) => {
              expect(getBrandResp.status).to.eq(404);
              expect(getBrandResp.body.message.toLowerCase()).to.include(
                "not found"
              );
            });
          });
        });
      });
    });

    it("Delete brand should fail, if this brand is already in use", () => {
      // Precondition: create new brand
      brandsApi.createNewBrand().then((brandInfo) => {
        // Precondition: make brand in use (make a product use this brand)
        productsApi.get().then((getProductsResp) => {
          // use the id of any product (i.e. 1st product)
          const firstProductId = getProductsResp.body.data[0].id;

          // store original product brand data (will be needed in tear down)
          const firstProductBrandData = getProductsResp.body.data[0].brand;

          // update product with new brand
          const updateProductReqBody = {
            brand_id: brandInfo.id,
          };
          productApi
            .update(firstProductId, updateProductReqBody)
            .then((updateProductResp) => {
              // Precondition: make sure, updating product is successful
              expect(updateProductResp.status).to.eq(200);
              expect(updateProductResp.body.success).to.eq(true);
              productApi.get(firstProductId).then((get1stProductResp) => {
                expect(get1stProductResp.body.brand.id).to.eq(brandInfo.id);
              });

              // delete new brand (which is now in use)
              cy.get(`@${tokenAliasName}`).then((token: any) => {
                brandApi.delete(brandInfo.id, token).then((deleteBrandResp) => {
                  // Assert, deleting brand fails
                  expect(deleteBrandResp.status).to.eq(409);
                  expect(deleteBrandResp.body.success).to.eq(false);
                  expect(deleteBrandResp.body.message).to.match(
                    /brand is used elsewhere/
                  );
                });
              });
            });

          // tear down: reset product brand
          cy.then(() => {
            const reqBody = {
              brand_id: firstProductBrandData.id,
            };
            productApi
              .update(firstProductId, reqBody)
              .then((updateProductResp) => {
                expect(updateProductResp.status).to.eq(200);
                expect(updateProductResp.body.success).to.eq(true);
                productApi.get(firstProductId).then((get1stProductResp) => {
                  expect(get1stProductResp.body.brand).to.deep.equal(
                    firstProductBrandData
                  );
                });
              });
          });
        });
      });
    });

    it("Should return unauthorized, if No valid token provided", () => {
      // Precondition: create new brand
      brandsApi.createNewBrand().then((brandInfo) => {
        const invalidToken = "";
        // delete
        brandApi.delete(brandInfo.id, invalidToken).then((deleteBrandResp) => {
          expect(deleteBrandResp.status).to.equal(401);
          expect(deleteBrandResp.body.message).to.equal("Unauthorized");
        });
      });
    });

    it("Should return forbidden, if unauthorized user is trying to delete a brand", () => {
      // Precondition: create new brand
      brandsApi.createNewBrand().then((brandInfo) => {
        // login as customer
        loginApi
          .login(users.customer2.EMAIL, users.customer2.PASSWORD)
          .then((loginResp) => {
            const customerToken = loginResp.body.access_token;
            // try to delete the new brand using the customer
            brandApi
              .delete(brandInfo.id, customerToken)
              .then((deleteBrandResp) => {
                expect(deleteBrandResp.status).to.eq(403);
                expect(deleteBrandResp.body.message.toLowerCase()).to.contain(
                  "forbidden"
                );
              });
          });
      });
    });
  });

  it("Should return Not allowed, if unsupported http method is used", () => {
    // Precondition: Create new brand
    brandsApi.createNewBrand().then((brandInfo) => {
      // request the api with unsupported method (POST)
      cy.request({
        url: `${apiHost}${apis.specificBrand.relativeUrl(brandInfo.id)}`,
        method: "POST",
        failOnStatusCode: false,
      }).then((brandResp) => {
        expect(brandResp.status).to.eq(405);
      });
    });
  });
});
