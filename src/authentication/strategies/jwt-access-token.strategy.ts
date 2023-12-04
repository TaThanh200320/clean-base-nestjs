import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { TokenPayload } from '@authentication/interfaces/jwt-payload.interface';
import { UsersService } from '@services/user.service';
import { access_token_public_key } from '@common/constants/jwt.constant';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: access_token_public_key,
        });
    }

    async validate(payload: TokenPayload) {
        return await this.usersService.findUserById(payload.user_id);
    }
}
