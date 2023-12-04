export function utc_now(): string {
    const now = new Date();
    return now.toISOString();
}
