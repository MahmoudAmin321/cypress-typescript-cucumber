class KeyboardFactory {
  getKey(bddKeyName: string): string {
    const lower = bddKeyName.toLowerCase();
    if (lower.match(/right( *)(-*)arrow/)) {
      return "{rightArrow}";
    } else if (lower.match(/left( *)(-*)arrow/)) {
      return "{leftArrow}";
    } else {
      throw Error(`[ ${bddKeyName} ] Not found in keyboard map`);
    }
  }
}

const keyboardFactory = new KeyboardFactory();
export default keyboardFactory;
