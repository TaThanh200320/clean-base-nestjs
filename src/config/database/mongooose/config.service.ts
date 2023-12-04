import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MongooseConfigService {
    constructor(private readonly configService: ConfigService) {}

    get host(): string {
        return this.configService.get<string>('mongoose.host');
    }

    get port(): number {
        return Number(this.configService.get<string>('mongoose.port'));
    }

    get username(): string {
        return this.configService.get<string>('mongoose.username');
    }

    get password(): string {
        return this.configService.get<string>('mongoose.password');
    }

    get database(): string {
        return this.configService.get<string>('mongoose.database');
    }

    get uri(): string {
        return `mongodb://${this.username}:${this.password}@${this.host}:${this.port}`;
    }
}
