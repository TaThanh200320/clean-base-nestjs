import * as bcrypt from 'bcryptjs';

import {
    BadRequestException,
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import {
    TokenAudience,
    TokenPayload,
} from './interfaces/jwt-payload.interface';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { SignUpResponse } from './interfaces/signup.interface';
import { User } from '@models/user.entity';
import { UsersService } from '@services/user.service';
import { access_token_private_key } from '@common/constants/jwt.constant';

@Injectable()
export class AuthService {
    private SALT_ROUND = 11;
    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async getAuthenticatedUser(email: string, password: string): Promise<User> {
        try {
            const user = await this.usersService.findUserByEmail(email);
            await this.verifyPlainContentWithHashedContent(
                password + user.salt,
                user.password,
            );
            return user;
        } catch (error) {
            throw new UnauthorizedException('Wrong credentials!!');
        }
    }

    async getUserIfRefreshTokenMatched(
        user_id: string,
        refresh_token: string,
    ): Promise<User> {
        try {
            const user = await this.usersService.findUserById(user_id);
            if (!user) {
                throw new UnauthorizedException('Unauthorized');
            }
            await this.verifyPlainContentWithHashedContent(
                refresh_token,
                user.current_refresh_token,
            );
            return user;
        } catch (error) {
            throw error;
        }
    }

    async signup(signup_dto: SignUpDto): Promise<SignUpResponse> {
        try {
            const existedUser = await this.usersService.findUserByEmail(
                signup_dto.email,
            );
            if (existedUser) {
                throw new ConflictException(
                    `User exsited by ${signup_dto.email}`,
                );
            }

            const user = await this.usersService.create(signup_dto);

            const refresh_token = this.generateRefreshToken({
                user_id: user._id.toString(),
                aud: TokenAudience.REFRESH.toString(),
            });
            await this.storeRefreshToken(user._id.toString(), refresh_token);

            return {
                access_token: this.generateAccessToken({
                    user_id: user._id.toString(),
                }),
                refresh_token: refresh_token,
            };
        } catch (error) {
            throw error;
        }
    }

    async storeRefreshToken(user_id: string, token: string): Promise<void> {
        try {
            const hashed_token = await bcrypt.hash(token, this.SALT_ROUND);
            await this.usersService.setCurrentRefreshToken(
                user_id,
                hashed_token,
            );
        } catch (error) {
            throw error;
        }
    }

    private async verifyPlainContentWithHashedContent(
        plain_text: string,
        hashed_text: string,
    ) {
        const is_matching = await bcrypt.compare(plain_text, hashed_text);
        if (!is_matching) {
            throw new BadRequestException('Content not match!!');
        }
    }

    private generateAccessToken(payload: TokenPayload) {
        return this.jwtService.sign(payload, {
            algorithm: 'RS256',
            privateKey: access_token_private_key,
        });
    }

    private generateRefreshToken(payload: TokenPayload) {
        return this.jwtService.sign(payload, {
            algorithm: 'RS256',
            privateKey: access_token_private_key,
            secret: 'lhnguyen',
            audience: 'refresh',
        });
    }
}
