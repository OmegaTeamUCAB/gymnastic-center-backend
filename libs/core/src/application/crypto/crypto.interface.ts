export interface ICrypto {
    hash(text: string, saltOrRounds: string | number): Promise<string>;
    compare(text: string, hashedText: string): Promise<boolean>;
}