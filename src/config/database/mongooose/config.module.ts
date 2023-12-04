import * as Joi from 'joi';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { Module } from '@nestjs/common';
import { MongooseConfigService } from './config.service';
import configuration from './configuration';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            validationSchema: Joi.object({
                MONGODB_HOST: Joi.string().default('0.0.0.0'),
                MONGODB_PORT: Joi.number().default(27017),
                MONGODB_USERNAME: Joi.string().default('admin'),
                MONGODB_PASSWORD: Joi.string().default('abcd1234'),
                MONGODB_DATABASE: Joi.string().default('ancorner_db'),
            }),
        }),
    ],
    providers: [MongooseConfigService, ConfigService],
    exports: [MongooseConfigService, ConfigService],
})
export class MongooseConfigModule {}
