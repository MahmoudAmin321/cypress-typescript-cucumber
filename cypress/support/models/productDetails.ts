import productDetailsPage from "../../pages/productDetails.pom";

export class DetailOfProduct {
  detail: { name: string; domElement: Cypress.Chainable<any> };

  constructor(bddProductDetail: string) {
    this.detail = this.getProductDetail(bddProductDetail);
    if (!this.detail) {
      throw Error(`[ ${bddProductDetail} ] Not found in the map`);
    }
  }

  getProductDetail(
    bddProductDetail: string
  ): { name: string; domElement: Cypress.Chainable<any> } | undefined {
    if (bddProductDetail.toLowerCase().match(/image/)) {
      return { name: "image", domElement: productDetailsPage.details.image() };
    } else if (bddProductDetail.toLowerCase().match(/name/)) {
      return { name: "name", domElement: productDetailsPage.details.name() };
    } else if (bddProductDetail.toLowerCase().match(/category/)) {
      return {
        name: "category",
        domElement: productDetailsPage.details.category(),
      };
    } else if (bddProductDetail.toLowerCase().match(/brand/)) {
      return { name: "brand", domElement: productDetailsPage.details.brand() };
    } else if (bddProductDetail.toLowerCase().match(/price/)) {
      return {
        name: "price",
        domElement: productDetailsPage.details.unitPrice(),
      };
    } else if (bddProductDetail.toLowerCase().match(/description/)) {
      return {
        name: "description",
        domElement: productDetailsPage.details.description(),
      };
    } else {
      return undefined;
    }
  }
}
