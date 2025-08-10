// 基本的な型定義
export const basicTypes = `
interface Array<T> {
  length: number;
  [n: number]: T;
}
interface Boolean {}
interface CallableFunction {}
interface Function {}
interface IArguments {}
interface NewableFunction {}
interface Number {}
interface Object {}
interface RegExp {}
interface String {}

// Utility Types for Level 2
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
}
type Required<T> = {
  [P in keyof T]-?: T[P];
}
type Partial<T> = {
  [P in keyof T]?: T[P];
}
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
}
type Record<K extends string | number | symbol, T> = {
  [P in K]: T;
}

// Additional types for Level 5
interface NodeListOf<T> {
  length: number;
  item(index: number): T | null;
  [index: number]: T;
}
interface HTMLDivElement {}
`;

// コンパイラオプションの型
export type CompilerOptions = {
  noEmit: boolean;
  target: number;
  module: number;
  moduleResolution: number;
  esModuleInterop: boolean;
  strict: boolean;
};
