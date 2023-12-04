import UsersRepository from 'src/repositories/user.repository';

import { User, UserSchema } from '@models/user.entity';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from '@services/user.service';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: User.name,
                useFactory: () => UserSchema,
            },
        ]),
    ],
    controllers: [],
    providers: [
        UsersService,
        {
            provide: 'UsersRepositoryInterface',
            useClass: UsersRepository,
        },
    ],
    exports: [UsersService],
})
export class UserModule {}
