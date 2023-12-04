import * as Joi from 'joi';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppConfigService } from './config.service';
import { Module } from '@nestjs/common';
import configuration from './configuration';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            validationSchema: Joi.object({
                APP_HOST: Joi.string().optional().default('0.0.0.0'),
                APP_PORT: Joi.number().optional().default(8080),
                APP_ENV: Joi.string().valid('dev', 'prod').default('dev'),
            }),
        }),
    ],
    providers: [AppConfigService, ConfigService],
    exports: [AppConfigService, ConfigService],
})
export class AppConfigModule {}
