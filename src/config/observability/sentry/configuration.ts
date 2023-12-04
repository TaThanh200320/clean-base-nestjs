import { registerAs } from '@nestjs/config';

export default registerAs('sentry', () => ({
    dsn: process.env.SENTRY_DSN,
    rate: {
        traces: process.env.SENTRY_TRACES_SAMPLE_RATE,
        profiles: process.env.SENTRY_PROFILES_SAMPLE_RATE,
    },
}));
