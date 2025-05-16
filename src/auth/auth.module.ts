import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LocalStrategy } from './strategies/local.stategy';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: () => {
        // A truly ESLint-safe approach using environment variable directly
        const envSecret = process.env.JWT_SECRET;
        const jwtSecret = envSecret || 'fallback_secret_for_dev';

        return {
          secret: jwtSecret,
          signOptions: { expiresIn: '15m' }, // access‑token TTL
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    LocalAuthGuard,
    LocalStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
