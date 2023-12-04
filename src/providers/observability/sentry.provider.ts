import { SentryConfigModule } from "@configs/observability/sentry/config.module";
import { SentryConfigService } from "@configs/observability/sentry/config.service";
import { Module } from "@nestjs/common";
import * as Sentry from "@sentry/node";
import { ProfilingIntegration } from "@sentry/profiling-node";

@Module({
  imports: [SentryConfigModule],
  providers: [SentryConfigService],
  exports: [SentryProviderModule],
})
export class SentryProviderModule {
  constructor(private readonly sentryConfigService: SentryConfigService) {}

  public initialize() {
    Sentry.init({
      dsn: this.sentryConfigService.dsn,
      integrations: [new ProfilingIntegration()],
      tracesSampleRate: this.sentryConfigService.tracesRate,
      profilesSampleRate: this.sentryConfigService.profilesRate,
    });
  }
}
