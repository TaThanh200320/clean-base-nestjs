import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppConfigService {
    constructor(private readonly configSevice: ConfigService) {}

    get host(): string {
        return this.configSevice.get<string>('app.host');
    }

    get port(): number {
        return Number(this.configSevice.get<number>('app.port'));
    }

    get env(): string {
        return this.configSevice.get<string>('app.env');
    }
}
