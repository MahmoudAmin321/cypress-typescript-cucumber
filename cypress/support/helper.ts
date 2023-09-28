export class Helper {
  static getRandomInteger(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static getAssertion(bddAssertion: string): string {
    let result = "";
    const not = "not.";
    const lower = bddAssertion.toLowerCase();

    if (lower.match(/n(o|')t /)) {
      result = not;
    }

    if (lower.match(/^is$/)) {
      result += "equal";
      return result;
    } else if (lower.match(/exist/)) {
      result += "exist";
      return result;
    } else if (lower.match(/contain/)) {
      result += "contain";
      return result;
    } else if (lower.match(/visible/)) {
      result += "be.visible";
      return result;
    } 
    else if (lower.match(/include/)) {
      result += "include";
      return result;
    }else {
      throw Error(`Invalid expected result [${bddAssertion}].`);
    }
  }
}
