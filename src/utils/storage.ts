function setLocal(field: string, value: string | null): void {
  /* istanbul ignore next */
  if (localStorage) {
    if (value) {
      window.localStorage.setItem(field, value);
    } else {
      window.localStorage.removeItem(field);
    }
  }
}

export default setLocal;
