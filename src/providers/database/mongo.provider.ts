import { Module } from '@nestjs/common';
import { MongooseConfigModule } from 'src/config/database/mongooose/config.module';
import { MongooseConfigService } from 'src/config/database/mongooose/config.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [MongooseConfigModule],
            useFactory: (configService: MongooseConfigService) => ({
                uri: configService.uri,
                dbName: configService.database,
                authSource: 'admin',
            }),
            inject: [MongooseConfigService],
        } as MongooseModuleAsyncOptions),
    ],
})
export class MongooseProviderModule {}
