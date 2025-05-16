import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  sub: number;
  username: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    // Using the same approach as auth.module.ts for consistency
    const envSecret = process.env.JWT_SECRET;
    const secretKey = envSecret || 'fallback_secret_for_dev';

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secretKey,
    });
  }

  validate(payload: JwtPayload) {
    console.log('JwtStrategy.validate payload:', payload);
    const user = { userId: payload.sub, username: payload.username };
    console.log('JwtStrategy.validate returns user:', user);
    return user;
  }
}
