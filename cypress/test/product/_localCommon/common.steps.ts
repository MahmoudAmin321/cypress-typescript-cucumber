import { Then } from "@badeball/cypress-cucumber-preprocessor";
import { DetailOfProduct } from "../../../support/models/productDetails";

Then(
    "{productDetail} is {string}",
    function (productDetail: DetailOfProduct, expectedValue: string) {
      const detailName = productDetail.detail.name;
      productDetail
        .getProductDetail(detailName)
        .domElement.invoke("text")
        .then((text: string) => {
          const actualValue = text.trim().toLowerCase();
          expect(actualValue).to.eq(expectedValue.toLowerCase());
        });
    }
  );