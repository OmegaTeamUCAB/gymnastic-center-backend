import { Injectable } from "@nestjs/common"
import { JwtService } from '@nestjs/jwt';
import { ITokenGenerator } from "@app/core/application/token/token-generator.interface";

type Payload = { id: string };

@Injectable()
export class JwtClass implements ITokenGenerator<Payload> {

    constructor(
        private jwtService: JwtService
    ) { }

    public generateToken(payload: Payload): string {
        return this.jwtService.sign(payload);
    }

    // podria usar clase generica para manejar try-catch
    public verifyToken(token: string): Payload {
        try {
            return this.jwtService.verify(token);
        } catch (error) {
            throw new Error("Verificación de token fallida "+ error.message);
        }
    }
}