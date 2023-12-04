export enum TokenAudience {
    ACCESS = 'Access',
    REFRESH = 'Refresh',
    FORGOT_PASSWORD = 'Forgot-password',
}

export interface TokenPayload {
    user_id: string;
    iat?: Date;
    aud?: string;
    exp?: Date;
    nbf?: Date;
    iss?: string;
}
