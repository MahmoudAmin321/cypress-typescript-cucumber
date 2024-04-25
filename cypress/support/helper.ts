import { dbIdRegex } from "./consts";

export class Helper {
  static getRandomInteger(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static validateBddArrEleOrder(bddArrEleOrder: string): string {
    const lowerTrimmed = bddArrEleOrder.trim().toLowerCase();
    if (!(lowerTrimmed.match(/\d+\./) || lowerTrimmed.match(/any/))) {
      throw Error(
        "bdd related product order should be Either <{nr}.> Or <any>"
      );
    }

    return lowerTrimmed;
  }

  static excludeKeys<T>(obj: T, keysToExclude: (keyof T)[]): T {
    const result: Partial<T> = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key) && !keysToExclude.includes(key)) {
        result[key] = obj[key];
      }
    }

    return result as T;
  }

  /**
   * @param dbJsonFile projectRoot/start_is_from_here
   */
  static storeCartIds(cartIds: string[], dbJsonFile: string) {
    // validate cart ids
    const validateCartIds = (ids0: string[]) => {
      const validateCartIds = (ids: string[]) => {
        if (ids.length === 0) {
          return;
        } else {
          const firstId = ids[0];
          const restIds = ids.slice(1);

          if (!firstId.match(dbIdRegex)) {
            throw Error(`Invalid cart id ${firstId}`);
          }
          return validateCartIds(restIds);
        }
      };

      // handle empty array case
      if (ids0.length === 0) {
        throw Error(`cart ids array cannot be empty`);
      }

      // trampoline
      return validateCartIds(ids0);
    };

    validateCartIds(cartIds);

    return cy.readFile(dbJsonFile).then((content) => {
      const storedCartIds: string[] = content.cart_ids;
      storedCartIds.push(...cartIds);
      return cy.writeFile(dbJsonFile, content);
    });
  }
}
