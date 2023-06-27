import { ProductCard } from "../components/productCard";

class ProductCards {
  getProductCards(): Cypress.Chainable<ProductCard[]> {
    const productCards: ProductCard[] = [];
    const chainableCards = cy.get("[class=card]");

    chainableCards.should(($cards) => {
      if ($cards.length === 0) {
        // If No cards found, return an empty array
        return productCards;
      }
    });

    chainableCards.each(($card) => {
      const cardComp = new ProductCard(() => $card);
      productCards.push(cardComp);
    });

    return cy.wrap(productCards);
  }
}

const productCards = new ProductCards();
export default productCards;
