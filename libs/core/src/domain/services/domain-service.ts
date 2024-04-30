export interface DomainService<T, R> {
  execute(data: T): R;
}
