export interface ReadModel<T, R> {
  execute(data: T): Promise<R>;
}
