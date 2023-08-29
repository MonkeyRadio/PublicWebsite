export default class LocalStorage {
  constructor(private name: string) {
    if (!localStorage.getItem(this.name)) localStorage.setItem(this.name, JSON.stringify({}));
  }

  public set(key: string, value: any) {
    const obj = JSON.parse(localStorage.getItem(this.name) || "{}");
    obj[key] = value;
    localStorage.setItem(this.name, JSON.stringify(obj));
  }

  public initialize(key: string, defaultValue: any) {
    const obj = JSON.parse(localStorage.getItem(this.name) || "{}");
    if (!obj[key]) {
      obj[key] = defaultValue;
      localStorage.setItem(this.name, JSON.stringify(obj));
    }
  }

  public remove(key: string) {
    const obj = JSON.parse(localStorage.getItem(this.name) || "{}");
    delete obj[key];
    localStorage.setItem(this.name, JSON.stringify(obj));
  }

  public get(key: string) {
    return JSON.parse(localStorage.getItem(this.name) || "{}")[key];
  }
}
