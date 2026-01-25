/**
 * Simple frontend rate limiter to prevent spamming actions.
 * Note: This is a deterrent, not a absolute security measure as it can be bypassed by power users.
 * For true rate limiting, use server-side middleware.
 */

interface RateLimitConfig {
    limit: number;      // Max attempts
    windowMs: number;   // Time window in milliseconds
}

const DEFAULT_CONFIG: RateLimitConfig = {
    limit: 5,
    windowMs: 60 * 1000, // 1 minute
};

export const rateLimiter = {
    check: (action: string, config: RateLimitConfig = DEFAULT_CONFIG): { allowed: boolean; remaining: number; resetTime?: number } => {
        const now = Date.now();
        const key = `rate_limit_${action}`;
        const storageData = localStorage.getItem(key);

        let attempts: number[] = [];

        if (storageData) {
            try {
                attempts = JSON.parse(storageData).filter((timestamp: number) => now - timestamp < config.windowMs);
            } catch (e) {
                attempts = [];
            }
        }

        if (attempts.length >= config.limit) {
            const oldestAttempt = attempts[0];
            const resetTime = oldestAttempt + config.windowMs;
            return {
                allowed: false,
                remaining: 0,
                resetTime
            };
        }

        attempts.push(now);
        localStorage.setItem(key, JSON.stringify(attempts));

        return {
            allowed: true,
            remaining: config.limit - attempts.length
        };
    },

    getWaitTimeSeconds: (resetTime: number): number => {
        return Math.max(0, Math.ceil((resetTime - Date.now()) / 1000));
    }
};
