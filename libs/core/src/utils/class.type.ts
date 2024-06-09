export interface ClassType<T> extends Function {
  new (...args: any[]): T;
}
