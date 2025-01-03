/// <reference types="vite/client" />

declare global {
  declare const __APP_NAME__: string;
  declare const __APP_VERSION__: string;

  type Solution = {
    uuid: string;
    title: string;
    description: string;
    documentation: string;
    tip: string;
    category?: string;
    integrated?: boolean;
    globals: { [key: string]: { value: string } };
    sectors: { [key: string]: { value: string[] } };
  };
}

export {};
