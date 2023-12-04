import { registerAs } from '@nestjs/config';

export default registerAs('api', () => ({
    version: process.env.API_VERSION,
    endpoint_prefix: process.env.API_ENDPOINT_PREFIX,
    openapi: {
        title: process.env.OPENAPI_TITLE,
        endpoint: process.env.OPENAPI_ENDPOINT,
        username: process.env.OPENAPI_USERNAME,
        password: process.env.OPENAPI_PASSWORD,
    },
}));
