import * as Joi from 'joi';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { SentryConfigService } from './config.service';
import configuration from './configuration';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            validationSchema: Joi.object({
                SENTRY_DSN: Joi.string().default(
                    'https://c6f73444269d679c0a3987763cbae37a@o4505672663105536.ingest.sentry.io/4506330569506816',
                ),
                SENTRY_TRACES_RATE: Joi.number().default(1.0),
                SENTRY_PROFILES_RATE: Joi.number().default(1.0),
            }),
        }),
    ],
    providers: [SentryConfigService, ConfigService],
    exports: [SentryConfigService, ConfigService],
})
export class SentryConfigModule {}
