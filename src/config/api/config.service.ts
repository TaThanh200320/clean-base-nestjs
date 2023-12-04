import { NextFunction, Request, Response } from 'express';

import { INestApplication, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Injectable()
export class ApiConfigService {
    constructor(private readonly configService: ConfigService) {}

    get api_version(): string {
        return this.configService.get<string>('api.version');
    }

    get endpoint_prefix(): string {
        return this.configService.get<string>('api.endpoint_prefix');
    }

    get openapi_config(): { [key: string]: string } {
        return this.configService.get<{ [key: string]: string }>('api.openapi');
    }

    public configSwagger(app: INestApplication) {
        const config = new DocumentBuilder()
            .setTitle(this.openapi_config.title)
            .setVersion(this.api_version)
            .addSecurity('token', { type: 'http', scheme: 'bearer' })
            .build();
        const document = SwaggerModule.createDocument(app, config);

        const http_adapter = app.getHttpAdapter();
        http_adapter.use(
            this.openapi_config.endpoint,
            (request: Request, response: Response, next: NextFunction) => {
                function parseAuthenticationHeader(val: string): {
                    username: string;
                    password: string;
                } {
                    const [, encodedPart] = val.split(' ');
                    const buff = Buffer.from(encodedPart, 'base64');
                    const text = buff.toString('ascii');
                    const [username, password] = text.split(':');

                    return { username, password };
                }

                function unauthorizedResponse(): void {
                    if (http_adapter.getType() === 'fastify') {
                        response.statusCode = 401;
                        response.setHeader('WWW-Authenticate', 'Basic');
                    } else {
                        response.status(401);
                        response.set('WWW-Authenticate', 'Basic');
                    }
                    next();
                }

                if (!request.headers.authorization) {
                    return unauthorizedResponse();
                }

                const swagger_credentials = parseAuthenticationHeader(
                    request.headers.authorization,
                );

                if (
                    this.openapi_config.username !==
                        swagger_credentials.username ||
                    this.openapi_config.password !==
                        swagger_credentials.password
                ) {
                    return unauthorizedResponse();
                }

                next();
            },
        );

        SwaggerModule.setup(this.openapi_config.endpoint, app, document, {
            swaggerOptions: {},
        });
    }
}
