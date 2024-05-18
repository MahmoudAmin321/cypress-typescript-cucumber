export type toastType = "success" | "failure" | "warning"
export class ToasterType {
  type: toastType;

  constructor(bddToasterType: string) {
    this.type = this.getToasterType(bddToasterType);
    if (!this.type) {
      throw Error(`[ ${bddToasterType} ] Not found in the map`);
    }
  }

  private getToasterType(bddToasterType: string): toastType | undefined {
    const lower = bddToasterType.toLowerCase()
    if (lower.match(/^success/)) {
      return "success";
    } else if (lower.match(/^(fail|err)/)) {
      return "failure";
    } 
    else if (lower.match(/^warn/)) {
      return "warning";
    }else {
      return undefined;
    }
  }
}
