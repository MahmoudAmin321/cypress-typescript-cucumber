export class ToasterType {
  type: string;

  constructor(bddToasterType: string) {
    this.type = this.getToasterType(bddToasterType);
    if (!this.type) {
      throw Error(`[ ${bddToasterType} ] Not found in the map`);
    }
  }

  private getToasterType(bddToasterType: string): string | undefined {
    if (bddToasterType.toLowerCase().match(/^success/)) {
      return "success";
    } else if (bddToasterType.toLowerCase().match(/^fail/)) {
      return "failure";
    } else {
      return undefined;
    }
  }
}
