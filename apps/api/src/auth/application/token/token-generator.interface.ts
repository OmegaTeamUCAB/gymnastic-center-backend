export interface TokenGenerator<T, P> {
  generateToken(payload: P): T;
}
