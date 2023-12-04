import { Injectable } from '@nestjs/common';
import { BaseRepositoryInterface } from './base/base-repository.interface';
import { BaseRepository } from './base/base-repository.abstract';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '@models/user.entity';

export interface UsersRepositoryInterface
    extends BaseRepositoryInterface<User> {}

@Injectable()
export default class UsersRepository
    extends BaseRepository<UserDocument>
    implements UsersRepositoryInterface
{
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    ) {
        super(userModel);
    }
}
