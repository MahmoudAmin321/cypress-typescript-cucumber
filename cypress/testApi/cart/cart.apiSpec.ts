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

      // TODO
      //------ should return error, if invalid product id is passed
      ///////////t non-existing
      ///////////t bool
      ///////////t alphabetic char
      ///////////t special char (i.e. $)
      //------ should return error, if invalid quantity is passed
      ///////////t 0
      ///////////t -ve
      ///////////t bool
      ///////////t alphabetic char
      ///////////t special char (i.e. $)
    });

    describe("retrieve cart", () => {
      ///t response of cart with items should have correct structure (key, type if needed)
      ///t response of empty cart should have empty items
      ///t in response, cart id should be same as request parameter
      ///t should return Not found, if invalid cart id is passed
      //t  should retrieve same product id as added product to cart
      /////////1 add item to cart
      ////////2 retrieve cart
      ///////3 product id in 2 should be same as 1
    });

    it("upon adding multiple quantities of same product, should retrieve total quantities", () => {});

    it("upon adding quantity of different products, should retrieve correct quantity for each product", () => {});
  });

  describe("delete cart", () => {
    ///t cart created without user sign in can be deleted without authorization
    ///t bug - cart created by signed-in user, can be deleted Only by this user
    ///t cart can be deleted, while it is Not empty
    ///t should return Not found, if invalid cart id is passed
  });
});

///////////structure///////////////////
///t /// should return method Not allowed, if unsupported method is passed

///==================================================================
//- add items to cart & retrieve cart

//--- add items to cart
///t should add product to cart successfully
///t should add product to Only target cart
///t should return Not found, if invalid cart id is passed
///t passing product id should be mandatory
///t passing quantity should be mandatory
//------ should return error, if invalid product id is passed
///////////t non-existing
///////////t bool
///////////t alphabetic char
///////////t special char (i.e. $)
//------ should return error, if invalid quantity is passed
///////////t 0
///////////t -ve
///////////t bool
///////////t alphabetic char
///////////t special char (i.e. $)

//--- retrieve cart
///t response of cart with items should have correct structure (key, type if needed)
///t response of empty cart should have empty items
///t in response, cart id should be same as request parameter
///t should return Not found, if invalid cart id is passed

//t  should retrieve same product id as added product to cart
/////////1 add item to cart
////////2 retrieve cart
///////3 product id in 2 should be same as 1

//t upon adding multiple quantities of same product, should retrieve total quantities

//t upon adding quantity of different products, should retrieve correct quantity for each product

///==================================================================
//- delete cart
///t cart created without user sign in can be deleted without authorization
///t bug - cart created by signed-in user, can be deleted Only by this user
///t cart can be deleted, while it is Not empty
///t should return Not found, if invalid cart id is passed