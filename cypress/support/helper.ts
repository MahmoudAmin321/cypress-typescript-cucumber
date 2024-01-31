export class Helper {
  static getRandomInteger(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static validateBddArrEleOrder(bddArrEleOrder: string): string {
    const lowerTrimmed = bddArrEleOrder.trim().toLowerCase()
    if (
      !(
        lowerTrimmed.match(/\d+\./) ||
        lowerTrimmed.match(/any/)
      )
    ) {
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
}
