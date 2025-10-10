import { apis } from "../../support/consts";
import cartApi from "../_common/apiPom/cart/cartApi";
import cartsApi from "../_common/apiPom/cart/cartsApi";
import productsApi from "../_common/apiPom/product/productsApi";

describe(`${apis.specificCartProduct.relativeUrl(
  "{cartId}",
  "{productId}"
)}`, () => {
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

  it("added item to a cart created without user sign in can be deleted without authorization", () => {
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
        cartApi.addProductToCart(cartId, reqBody).then((addProdToCartResp) => {
          // assert
          expect(addProdToCartResp.isOkStatusCode).to.eq(true);
          expect(addProdToCartResp.body.result).to.contain("item added");

          // delete product from cart
          cartApi
            .deleteProductFromCart(cartId, productId)
            .then((deleteProdFromCartResp) => {
              // assert
              expect(deleteProdFromCartResp.isOkStatusCode).to.eq(true);

              // make sure, deleted product exists No more in the cart
              cartApi.get(cartId).then((cartResp) => {
                expect(cartResp.body.cart_items).to.deep.eq([]);
              });
            });
        });
      });
    });
  });

  //t bug - added item to a cart created by signed-in user, can be deleted Only by this user

  it("should return Not found, if invalid cart id is passed", () => {
    const invalidCartId = "invalid cart id";
    // precondition: create product
    productsApi.createProduct().then((productResp) => {
      const productId: string = productResp.body.id;

      // delete product from cart
      cartApi
        .deleteProductFromCart(invalidCartId, productId)
        .then((deleteProdFromCartResp) => {
          // assert
          expect(deleteProdFromCartResp.status).to.eq(404);
          const errorMsg: string =
            deleteProdFromCartResp.body.message.toLowerCase();
          expect(errorMsg).to.match(/n(.*)t exist/);
        });
    });
  });

  describe.skip("should return error, if invalid product id is passed", () => {
    function testInvalidProduct(invalidProductId) {
      // precondition: create cart
      cartsApi.createAndStoreCart().then((postCartResp) => {
        const cartId: string = postCartResp.body.id;

        // delete product from cart
        cartApi
          .deleteProductFromCart(cartId, invalidProductId)
          .then((deleteProdFromCart) => {
            // assert
            expect(deleteProdFromCart.status).to.eq(422);
            const errorMsg: string =
              deleteProdFromCart.body.message.toLowerCase();
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
