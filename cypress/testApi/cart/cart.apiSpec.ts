import { apis } from "../../support/consts";
import { apiHost } from "../../support/cyEnvVar";
import cartApi from "../_common/apiPom/cart/cartApi";
import cartsApi from "../_common/apiPom/cart/cartsApi";
import productsApi from "../_common/apiPom/product/productsApi";

describe(`${apis.specificCart.relativeUrl("{cartId}")}`, () => {
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
    // delete stored carts
    cartApi.setUp();
  });

  describe("add items to cart & retrieve cart", () => {
    it("should return method Not allowed, if unsupported method is passed", () => {
      // Precondition: Create new cart
      cartsApi.createAndStoreCart().then((postCartResp) => {
        // request the api with unsupported method (PATCH)
        cy.request({
          url: `${apiHost}${apis.specificCart.relativeUrl(
            postCartResp.body.id
          )}`,
          method: "PATCH",
          failOnStatusCode: false,
        }).then((cartResp) => {
          expect(cartResp.status).to.eq(405);
        });
      });
    });

    describe("add items to cart", () => {
      it("should add product to cart successfully", () => {
        // precondition: create cart
        cartsApi.createAndStoreCart().then((postCartResp) => {
          const cartId: string = postCartResp.body.id;

          // precondition: create product
          productsApi.createProduct().then((productResp) => {
            const productId: string = productResp.body.id;
            const reqBody = {
              product_id: productId,
              quantity: cartApi.defaultProductQuantity,
            };

            // add product to cart
            cartApi
              .addProductToCart(cartId, reqBody)
              .then((addProdToCartResp) => {
                // assert
                expect(addProdToCartResp.isOkStatusCode).to.eq(true);
                expect(addProdToCartResp.body.result).to.contain("item added");

                // make sure, product got added to cart
                cartApi.get(cartId).then((cartResp) => {
                  expect(cartResp.body.cart_items[0].product_id).to.eq(
                    productId
                  );
                  expect(cartResp.body.cart_items[0].quantity).to.eq(
                    cartApi.defaultProductQuantity
                  );
                });
              });
          });
        });
      });

      it("should add product to Only target cart", () => {
        // precondition: create 1st cart
        cartsApi.createAndStoreCart().then((postCartResp) => {
          const cartId1: string = postCartResp.body.id;

          // precondition: create 2nd cart
          cartsApi.createAndStoreCart().then((postCartResp) => {
            const cartId2: string = postCartResp.body.id;

            // precondition: create product
            productsApi.createProduct().then((productResp) => {
              const productId: string = productResp.body.id;
              const reqBody = {
                product_id: productId,
                quantity: cartApi.defaultProductQuantity,
              };

              // add product to cart
              cartApi
                .addProductToCart(cartId1, reqBody)
                .then((addProdToCartResp) => {
                  // assert
                  expect(addProdToCartResp.isOkStatusCode).to.eq(true);

                  // make sure, product got added to cart1
                  cartApi.get(cartId1).then((cartResp) => {
                    expect(cartResp.body.cart_items[0].product_id).to.eq(
                      productId
                    );
                  });

                  // make sure, product Not added to cart2
                  cartApi.get(cartId2).then((cartResp) => {
                    expect(cartResp.body.cart_items).to.deep.eq([]);
                  });
                });
            });
          });
        });
      });

      it("should return Not found, if invalid cart id is passed", () => {
        const invalidCartId = "invalid cart id";
        // precondition: create product
        productsApi.createProduct().then((productResp) => {
          const productId: string = productResp.body.id;
          const reqBody = {
            product_id: productId,
            quantity: cartApi.defaultProductQuantity,
          };

          // add product to cart
          cartApi
            .addProductToCart(invalidCartId, reqBody)
            .then((addProdToCartResp) => {
              // assert
              expect(addProdToCartResp.status).to.eq(404);
              const errorMsg: string =
                addProdToCartResp.body.message.toLowerCase();
              expect(errorMsg).to.include("not found");
            });
        });
      });

      it("bug - passing product id should be mandatory", () => {
        // precondition: create cart
        cartsApi.createAndStoreCart().then((postCartResp) => {
          const cartId: string = postCartResp.body.id;
          const reqBody = {
            quantity: cartApi.defaultProductQuantity,
          };

          // add product to cart
          cartApi
            .addProductToCart(cartId, reqBody)
            .then((addProdToCartResp) => {
              // assert
              expect(addProdToCartResp.status).to.eq(422);
              const errorMsg: string =
                addProdToCartResp.body.message.toLowerCase();
              expect(errorMsg).to.include("product id is mandatory");
            });
        });
      });

      it("bug - passing quantity should be mandatory", () => {
        // precondition: create cart
        cartsApi.createAndStoreCart().then((postCartResp) => {
          const cartId: string = postCartResp.body.id;
          // precondition: create product
          productsApi.createProduct().then((productResp) => {
            const productId: string = productResp.body.id;

            const reqBody = {
              product_id: productId,
            };

            // add product to cart
            cartApi
              .addProductToCart(cartId, reqBody)
              .then((addProdToCartResp) => {
                // assert
                expect(addProdToCartResp.status).to.eq(422);
                const errorMsg: string =
                  addProdToCartResp.body.message.toLowerCase();
                expect(errorMsg).to.include("quantity is mandatory");
              });
          });
        });
      });

      describe.skip("should return error, if invalid product id is passed", () => {
        function testInvalidProduct(invalidProductId) {
          // precondition: create cart
          cartsApi.createAndStoreCart().then((postCartResp) => {
            const cartId: string = postCartResp.body.id;

            const reqBody = {
              product_id: invalidProductId,
              quantity: cartApi.defaultProductQuantity,
            };

            // add product to cart
            cartApi
              .addProductToCart(cartId, reqBody)
              .then((addProdToCartResp) => {
                // assert
                expect(addProdToCartResp.status).to.eq(422);
                const errorMsg: string =
                  addProdToCartResp.body.message.toLowerCase();
                expect(errorMsg).to.include("invalid product");
              });
          });
        }

        it("bug - non-existing", () => {
          testInvalidProduct("nonExistingProdId");
        });

        it("bug - boolean", () => {
          testInvalidProduct(true);
        });

        it("bug - special char", () => {
          testInvalidProduct("$§&*");
        });
      });

      describe("should return error, if invalid quantity is passed", () => {
        function sendInvaildQuantity(
          invalidQuantity
        ): Cypress.Chainable<Cypress.Response<any>> {
          // precondition: create cart
          return cartsApi.createAndStoreCart().then((postCartResp) => {
            const cartId: string = postCartResp.body.id;

            // precondition: create product
            return productsApi.createProduct().then((productResp) => {
              const productId: string = productResp.body.id;

              const reqBody = {
                product_id: productId,
                quantity: invalidQuantity,
              };

              // add product to cart
              return cartApi.addProductToCart(cartId, reqBody);
            });
          });
        }

        function assertInvalidNumericQuantity(
          addProdToCartResp: Cypress.Response<any>
        ) {
          expect(addProdToCartResp.status).to.eq(422);
          const errorMsg: string = addProdToCartResp.body.message.toLowerCase();
          expect(errorMsg).to.include("invalid quantity");
        }

        function assertNonNumericQuantity(
          addProdToCartResp: Cypress.Response<any>
        ) {
          expect(addProdToCartResp.status).to.eq(400);
          const errorMsg: string = addProdToCartResp.body.message.toLowerCase();
          expect(errorMsg).to.include(
            "non-numeric value passed to increment method"
          );
        }

        it("bug - zero", () => {
          sendInvaildQuantity(0).then((addProdToCartResp) => {
            assertInvalidNumericQuantity(addProdToCartResp);
          });
        });

        it("bug - -ve nr", () => {
          sendInvaildQuantity(-1).then((addProdToCartResp) => {
            assertInvalidNumericQuantity(addProdToCartResp);
          });
        });

        it("boolean", () => {
          sendInvaildQuantity(true).then((addProdToCartResp) => {
            assertNonNumericQuantity(addProdToCartResp);
          });
        });

        it("bug - alphabetic char", () => {
          sendInvaildQuantity("A").then((addProdToCartResp) => {
            assertNonNumericQuantity(addProdToCartResp);
          });
        });

        it("bug - special char", () => {
          sendInvaildQuantity("$").then((addProdToCartResp) => {
            assertNonNumericQuantity(addProdToCartResp);
          });
        });
      });
    });

    describe("retrieve cart", () => {
      it("response of cart with items should have correct structure", () => {
        // precondition: create cart
        cartsApi.createAndStoreCart().then((postCartResp) => {
          const cartId: string = postCartResp.body.id;

          // precondition: create product
          productsApi.createProduct().then((productResp) => {
            const productId: string = productResp.body.id;
            const reqBody = {
              product_id: productId,
              quantity: cartApi.defaultProductQuantity,
            };

            // precondition: add product to cart
            cartApi.addProductToCart(cartId, reqBody).then(() => {
              // retrieve cart
              cartApi.get(cartId).then((cartResp) => {
                expect(cartResp.body.id).to.be.a("string").and.to.be.ok; // ok refers to "truthy"
                expect(cartResp.body)
                  .to.have.property("cart_items")
                  .that.is.an("array").and.to.be.ok;
                expect(cartResp.body.cart_items[0].product_id).to.be.a("string")
                  .and.to.be.ok; // ok refers to "truthy"
                expect(cartResp.body.cart_items[0].quantity).to.be.a("number");
              });
            });
          });
        });
      });

      it("response of empty cart should have empty items", () => {
        // precondition: create cart
        cartsApi.createAndStoreCart().then((postCartResp) => {
          const cartId: string = postCartResp.body.id;

          // retrieve cart
          cartApi.get(cartId).then((cartResp) => {
            expect(cartResp.body.cart_items).to.deep.eq([]);
          });
        });
      });

      it("in response, cart id should be same as request parameter", () => {
        // precondition: create cart
        cartsApi.createAndStoreCart().then((postCartResp) => {
          const cartId: string = postCartResp.body.id;

          // retrieve cart
          cartApi.get(cartId).then((cartResp) => {
            expect(cartResp.body.id).to.eq(cartId);
          });
        });
      });

      it("should retrieve same product id as added product to cart", () => {
        // precondition: create cart
        cartsApi.createAndStoreCart().then((postCartResp) => {
          const cartId: string = postCartResp.body.id;

          // precondition: create product
          productsApi.createProduct().then((productResp) => {
            const productId: string = productResp.body.id;
            const reqBody = {
              product_id: productId,
              quantity: cartApi.defaultProductQuantity,
            };

            // precondition: add product to cart
            cartApi.addProductToCart(cartId, reqBody).then(() => {
              // retrieve cart
              cartApi.get(cartId).then((cartResp) => {
                expect(cartResp.body.cart_items[0].product_id).to.eq(productId);
              });
            });
          });
        });
      });

      it("should return Not found, if invalid cart id is passed", () => {
        const invalidCartId = "ABC123EDFafsadflaflafdadskf";

        // retrieve cart
        cartApi.get(invalidCartId).then((cartResp) => {
          expect(cartResp.status).to.eq(404);
        });
      });
    });

    it("upon adding multiple quantities of same product, should retrieve total quantities", () => {
      cartApi.checkQuantity(3);
    });

    it("upon adding quantity of different products, should retrieve correct quantity for each product", () => {
      cartApi.checkQuantity(3);
      cartApi.checkQuantity(5);
    });
  });

  describe("delete cart", () => {
    it("cart created without user sign in can be deleted without authorization", () => {
      cartsApi.createAndStoreCart().then((postCartResp) => {
        const cartId = postCartResp.body.id;
        cartApi.delete(cartId).then((deleteCartResp) => {
          expect(deleteCartResp.isOkStatusCode).to.eq(true);

          // make sure, deleted cart exists No more
          cartApi.get(cartId).then((cartResp) => {
            expect(cartResp.status).to.eq(404);
          });
        });
      });
    });

    ///t manual .. bug - cart created by signed-in user, can be deleted Only by this user

    it("cart can be deleted, while it is Not empty", () => {
      cartsApi.createAndStoreCart().then((postCartResp) => {
        const cartId: string = postCartResp.body.id;

        // precondition: create product
        productsApi.createProduct().then((productResp) => {
          const productId: string = productResp.body.id;
          const reqBody = {
            product_id: productId,
            quantity: cartApi.defaultProductQuantity,
          };

          // add product to cart
          cartApi
            .addProductToCart(cartId, reqBody)
            .then((addProdToCartResp) => {
              // assert
              expect(addProdToCartResp.isOkStatusCode).to.eq(true);
              expect(addProdToCartResp.body.result).to.contain("item added");

              cartApi.delete(cartId).then((deleteCartResp) => {
                expect(deleteCartResp.isOkStatusCode).to.eq(true);
              });
            });
        });
      });

      cartsApi.createAndStoreCart().then((postCartResp) => {
        const cartId = postCartResp.body.id;

        cartApi.delete(cartId).then((deleteCartResp) => {
          expect(deleteCartResp.isOkStatusCode).to.be.true;
        });
      });
    });

    ///t should return Not found, if invalid cart id is passed
    it("should return Not found, if invalid cart id is passed", () => {
      const invalidCartId = "afdsjsadbnksd"
      cartApi.delete(invalidCartId).then((deleteCartResp) => {
          expect(deleteCartResp.status).to.eq(404);
          expect(deleteCartResp.body.message).to.match(/doesn(.*)t exist/);

        });
     });
  });
});
