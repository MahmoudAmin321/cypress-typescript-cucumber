export type toastType = "success" | "failure" | "warning";
export class ToasterType {
  type: toastType;

  constructor(bddToasterType: string) {
    this.type = this.getToasterType(bddToasterType);
    if (!this.type) {
      throw Error(`[ ${bddToasterType} ] Not found in the map`);
    }
  }

  private getToasterType(bddToasterType: string): toastType | undefined {
    const value = bddToasterType.toLowerCase().trim();
    if (value.match(/^success/)) {
      return "success";
    } else if (value.match(/^(fail|er(.*)r)/)) {
      return "failure";
    } else if (value.match(/^warn/)) {
      return "warning";
    } else {
      return undefined;
    }
  }
}
