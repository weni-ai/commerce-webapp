/// <reference types="vite/client" />

declare global {
  type Solution = {
    uuid: string;
    title: string;
    description: string;
    documentation: string;
    tip: string;
    flows: { uuid: string; name: string }[];
    globals: { [key: string]: { value: string } };
    sectors: { [key: string]: { value: string[] } };
  };
}

export {};
