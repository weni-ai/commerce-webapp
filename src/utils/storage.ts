function setLocal(field: string, value: string | null): void {
  if (localStorage) {
    if (value) {
      window.localStorage.setItem(field, value);
    } else {
      window.localStorage.removeItem(field);
    }
  }
}

export default setLocal;
