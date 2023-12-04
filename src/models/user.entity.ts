import * as bcrypt from 'bcryptjs';

import { Exclude, Expose } from 'class-transformer';
import { HydratedDocument, UpdateQuery } from 'mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose';

import { BaseEntity } from './base.entity';
import { BaseSchema } from '@common/decorators/base-schema.decorator';
import { NextFunction } from 'express';
import { utc_now } from '@common/helpers/date.helper';

export type UserDocument = HydratedDocument<User>;
export const USERS_COLLECTION = 'users';

export enum UsersStatues {
    UNCONFIRMED = 'UNCONFIRMED', // default, after registration (can't log in, need to active through email)
    CONFIRMED = 'CONFIRMED', // after confirmation by email (all good state)
    FORCE_CHANGE_PASSWORD = 'FORCE_CHANGE_PASSWORD', // confirmed, but users need to update temporary password
    EXTERNAL_PROVIDER = 'EXTERNAL_PROVIDER', // logged via Google, Meta, etc...
    ARCHIVED = 'ARCHIVED', // deleted users (force randomized email and data)
}

@BaseSchema({
    collection: USERS_COLLECTION,
})
export class User extends BaseEntity {
    @Prop({
        required: true,
        trim: true,
        sparse: true,
        index: true,
        unique: true,
    })
    email: string;

    @Prop({
        required: true,
        trim: true,
    })
    @Exclude()
    password: string;

    @Prop({
        trim: true,
    })
    @Exclude()
    salt: string;

    @Prop({
        enum: UsersStatues,
        default: UsersStatues.UNCONFIRMED,
    })
    status: string;

    @Prop({
        default: 'https://avatar.com',
        trim: true,
    })
    avatar: string;

    @Prop({ default: false })
    is_admin: boolean;

    @Prop({ default: true })
    is_staff: boolean;

    @Prop({ default: utc_now() })
    join_time: Date;

    @Prop({ default: utc_now() })
    last_login_time: Date;

    @Prop()
    @Exclude()
    current_refresh_token: string;

    @Expose({ name: 'username' })
    get username(): string {
        return `${this.email.split('@')[0]}`;
    }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next: NextFunction) {
    const current_user = this;

    if (!current_user.password || !current_user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(10, (genSaltError, salt) => {
        if (genSaltError) {
            return next(genSaltError);
        }

        current_user.salt = salt;
        bcrypt.hash(current_user.password + salt, salt, (err, hash) => {
            if (err) {
                return next(err);
            }

            current_user.password = hash;
            next();
        });
    });
});

UserSchema.pre('updateOne', function (next: NextFunction) {
    const currnet_user = this.getUpdate() as UpdateQuery<User>;

    if (!currnet_user.password) {
        return next();
    }

    bcrypt.genSalt(10, (genSaltError, salt) => {
        if (genSaltError) {
            return next(genSaltError);
        }

        currnet_user.salt = salt;
        bcrypt.hash(currnet_user.password + salt, salt, (err, hash) => {
            if (err) {
                return next(err);
            }
            currnet_user.password = hash;
            next();
        });
    });
});
