export class Helper {
  static getRandomInteger(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static getAssertion(bddAssertion: string): string {
    const lower = bddAssertion.toLowerCase();
    if (lower.match(/(^exist)|(^is$)/)) {
      return "";
    } else if (lower.match(/(not exist)|(is( *)n(o|')t)/)) {
      return "not.";
    } else {
      throw Error(`Invalid expected result [${bddAssertion}].`);
    }
  }
}
