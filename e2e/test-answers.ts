// 各レベルの正解答案
export const ANSWERS = {
  level1: [
    'type User = { name: string; age: number };\nconst u: User = { name: "Taro", age: 20 };',
    'type Point = { x: number; y: number };\nconst p: Point = { x: 1, y: 2 };',
    'const greet: (name: string) => string = (name: string) => `Hello, ${name}`;',
    'type Pair = [number, number];\nconst pair: Pair = [1, 2];',
    'interface Animal { name: string }\ninterface Dog extends Animal { bark(): void }',
  ],
  level2: [
    'type User = { name: string; age: number };\ntype ReadonlyUser = Readonly<User>;',
    'type Options = { a?: string; b?: number };\ntype RequiredOptions = Required<Options>;',
    'type User = { name: string; age: number };\ntype PartialUser = Partial<User>;',
    'type User = { name: string; age: number };\ntype PickName = Pick<User, "name">;',
    'type User = { name: string; age: number };\ntype RecordUser = Record<string, User>;',
  ],
  level3: [
    'function identity<T>(value: T): T;',
    'function wrapInArray<T>(value: T): T[];',
    'interface Box<T> { value: T }\nfunction makeBox<T>(v: T): Box<T>;',
    'function first<T>(arr: T[]): T;',
    'type Mapper<T, U> = (value: T) => U;',
  ],
  level4: [
    'type OnlyString<T> = T extends string ? T : never;\ntype R = OnlyString<string | number | boolean>;',
    "type IsString<T> = T extends string ? true : false;\ntype R = IsString<'a'>;",
    'type ExcludeNull<T> = T extends null ? never : T;\ntype R = ExcludeNull<string | null>;',
    'type IfElse<T, U> = T extends true ? U : never;\ntype R = IfElse<true, number>;',
    'type Flatten<T> = T extends (infer U)[] ? U : T;\ntype R = Flatten<string[]>;',
  ],
  level5: [
    'type GetReturnType<T> = T extends (...a: infer A) => infer R ? R : never;\ntype R = GetReturnType<() => number>;',
    'type UnpackArray<T> = T extends readonly (infer U)[] ? U : never;\ntype R = UnpackArray<string[]>;',
    'type Params<T> = T extends (...a: infer P) => infer R ? P : never;\ntype R = Params<(a: number, b: string) => void>;',
    'type InferBoxValue<T> = T extends { value: infer V } ? V : never;\ntype R = InferBoxValue<{value: boolean}>;',
    'type ElementType<T> = T extends NodeListOf<infer E> ? E : never;\ntype R = ElementType<NodeListOf<HTMLDivElement>>;',
  ],
};
