/// <reference types="vite/client" />

declare global {
  declare const __APP_NAME__: string;
  declare const __APP_VERSION__: string;

  type Solution = {
    version: string;
    uuid: string;
    title: string;
    description: string;
    documentation: string;
    tip: string;
    globals: { [key: string]: { value: string } };
    sectors: { [key: string]: { value: string[] } };
    versions: {
      version: string;
      globals: { [key: string]: { value: string } };
      sectors: { [key: string]: { value: string[] } };
    }[];
  };
}

export {};
