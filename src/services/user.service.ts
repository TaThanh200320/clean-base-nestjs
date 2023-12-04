import { CreateUserDto } from 'src/dtos/users/create-user.dto';
import { BaseService } from './base/base-service.abstract';
import {
    ConflictException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { UsersRepositoryInterface } from 'src/repositories/user.repository';
import { SaveOptions } from 'mongoose';
import { User } from '@models/user.entity';

@Injectable()
export class UsersService extends BaseService<User> {
    constructor(
        @Inject('UsersRepositoryInterface')
        private readonly usersRepsository: UsersRepositoryInterface,
    ) {
        super(usersRepsository);
    }

    async create(dto: CreateUserDto, saveOptions?: SaveOptions): Promise<User> {
        const exsitedUser = await this.usersRepsository.findOne({
            email: dto.email,
        });

        if (exsitedUser) {
            throw new ConflictException(`User existed by ${dto.email}`);
        }
        const createdUser = await super.create(dto, saveOptions);
        return createdUser;
    }

    async findUserById(user_id: string): Promise<User> {
        const exsitedUser = await this.usersRepsository.findOneById(user_id);
        if (!exsitedUser) {
            throw new NotFoundException(`User not found by ${user_id}`);
        }

        return exsitedUser;
    }

    async findUserByEmail(email: string): Promise<User> {
        const exsitedUser = await this.usersRepsository.findOne({
            email: email,
        });

        if (!exsitedUser) {
            throw new NotFoundException(`User not found ${email}`);
        }

        return exsitedUser;
    }

    async setCurrentRefreshToken(
        id: string,
        hashed_token: string,
    ): Promise<void> {
        await this.usersRepsository.updateById(id, {
            current_refresh_token: hashed_token,
        });
    }
}
