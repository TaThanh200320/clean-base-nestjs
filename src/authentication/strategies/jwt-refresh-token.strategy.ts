import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from '@authentication/auth.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { TokenPayload } from '@authentication/interfaces/jwt-payload.interface';
import { refresh_token_public_key } from '@common/constants/jwt.constant';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
    Strategy,
    'refresh_token',
) {
    constructor(private readonly auth_service: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: refresh_token_public_key,
            passReqToCallback: true,
        });
    }

    async validate(request: Request, payload: TokenPayload) {
        return await this.auth_service.getUserIfRefreshTokenMatched(
            payload.user_id,
            request.headers.authorization.split('Bearer ')[1],
        );
    }
}
