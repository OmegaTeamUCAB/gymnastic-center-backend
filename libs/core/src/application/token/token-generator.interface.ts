export interface ITokenGenerator<T> {
    generateToken(payload: T): string;
    verifyToken(token: string): any;
}