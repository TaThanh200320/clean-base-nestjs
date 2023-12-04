import * as Joi from 'joi';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { ApiConfigService } from './config.service';
import { Module } from '@nestjs/common';
import configuration from './configuration';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            validationSchema: Joi.object({
                API_VERSION: Joi.string().default('v1'),
                API_ENDPOINT_PREFIX: Joi.string().default('api'),
                OPENAPI_ENDPOINT: Joi.string().default('api-docs'),
            }),
        }),
    ],
    providers: [ApiConfigService, ConfigService],
    exports: [ApiConfigService, ConfigService],
})
export class ApiConfigModule {}
