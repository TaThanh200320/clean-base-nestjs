import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SentryConfigService {
  constructor(private readonly configService: ConfigService) {}

  get dsn(): string {
    return this.configService.get<string>("sentry.dsn");
  }

  get tracesRate(): number {
    return this.configService.get<number>("sentry.rate.traces");
  }

  get profilesRate(): number {
    return this.configService.get<number>("sentry.rate.profiles");
  }
}
