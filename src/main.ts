import { ApiConfigService } from '@configs/api/config.service';
import { NestFactory } from '@nestjs/core';
import * as Sentry from '@sentry/node';

import { AppModule } from './app.module';
import { AppConfigService } from './config/app/config.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const appConfig: AppConfigService = app.get(AppConfigService);
    const apiConfig: ApiConfigService = app.get(ApiConfigService);
    apiConfig.configSwagger(app);
    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.tracingHandler());
    app.use(Sentry.Handlers.errorHandler());

    await app.listen(appConfig.port);
}
bootstrap();
