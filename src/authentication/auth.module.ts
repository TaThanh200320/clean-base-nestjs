import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAccessTokenStrategy } from '@authentication/strategies/jwt-access-token.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshTokenStrategy } from '@authentication/strategies/jwt-refresh-token.strategy';
import { LocalStrategy } from '@authentication/strategies/local.strategy';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/modules/user.module';

@Module({
    imports: [UserModule, PassportModule, JwtModule.register({})],
    controllers: [AuthController],
    providers: [
        AuthService,
        LocalStrategy,
        JwtAccessTokenStrategy,
        JwtRefreshTokenStrategy,
    ],
})
export class AuthModule {}
