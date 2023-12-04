import { ApiConfigModule } from '@configs/api/config.module';
import { AppConfigModule } from '@configs/app/config.module';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './authentication/auth.module';
import { MongooseProviderModule } from './providers/database/mongo.provider';
import { SentryProviderModule } from './providers/observability/sentry.provider';

@Module({
    imports: [
        AppConfigModule,
        ApiConfigModule,
        MongooseProviderModule,
        AuthModule,
        SentryProviderModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
