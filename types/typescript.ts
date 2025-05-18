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
`;

// コンパイラオプションの型
export interface CompilerOptions {
  noEmit: boolean;
  target: number;
  module: number;
  moduleResolution: number;
  esModuleInterop: boolean;
  strict: boolean;
} 