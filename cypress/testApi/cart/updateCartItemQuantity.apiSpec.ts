import { apis } from "../../support/consts";
import cartApi from "../_common/apiPom/cart/cartApi";
import cartsApi from "../_common/apiPom/cart/cartsApi";
import productsApi from "../_common/apiPom/product/productsApi";

describe(`${apis.cartProductQuantity.relativeUrl("{cartId}")}`, () => {
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

  describe("update cart item quantity", () => {
    it("should update cart item quantity successfully", () => {
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

              // update quanity
              const newQuantity = 3;
              reqBody.quantity = newQuantity;
              cartApi
                .updateQuantity(cartId, reqBody)
                .then((updateQuantityResp) => {
                  // assert
                  expect(updateQuantityResp.isOkStatusCode).to.eq(true);

                  // make sure, quantity got updated
                  cartApi.get(cartId).then((cartResp) => {
                    expect(cartResp.body.cart_items[0].product_id).to.eq(
                      productId
                    );
                    expect(cartResp.body.cart_items[0].quantity).to.eq(
                      newQuantity
                    );
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

        // update quanity
        cartApi
          .updateQuantity(invalidCartId, reqBody)
          .then((updateQuantityResp) => {
            // assert
            expect(updateQuantityResp.status).to.eq(404);
            const errorMsg: string =
              updateQuantityResp.body.message.toLowerCase();
            expect(errorMsg).to.match(/n(.*)t exist/);
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

          // update quanity
          cartApi.updateQuantity(cartId, reqBody).then((updateQuantityResp) => {
            // assert
            expect(updateQuantityResp.status).to.eq(422);
            const errorMsg: string =
              updateQuantityResp.body.message.toLowerCase();
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
  });
});
