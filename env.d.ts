/// <reference types="vite/client" />

declare global {
  type Solution = {
    uuid: string;
    title: string;
    description: string;
    documentation: string;
    tip: string;
    globals: string[];
    flows: { uuid: string; name: string }[];
    sectors: string[];
  };
}

export {};
