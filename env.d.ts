/// <reference types="vite/client" />

declare global {
  type Solution = {
    id: string;
    title: string;
    description: string;
    tip: string;
    globals: string[];
    mockedValues: {
      [key: string]: string | string[] | boolean;
    };
  };
}

export {};
