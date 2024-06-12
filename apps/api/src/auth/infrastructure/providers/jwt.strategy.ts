import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Model } from 'mongoose';
import { MongoCredentials } from '../models/mongo-credentials.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectModel(MongoCredentials.name)
    private readonly credentialsModel: Model<MongoCredentials>,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: { id: string }): Promise<any> {
    const { id } = payload;
    const credentials = await this.credentialsModel.findOne({ userId: id });
    if (!credentials) throw new UnauthorizedException('Invalid token.');
    return credentials;
  }
}
