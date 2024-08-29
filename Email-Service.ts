// src/EmailService.ts
import { EmailProvider } from './EmailProvider';

interface Status {
    success: boolean;
    retries: number;
    provider: string;
}

export class EmailService {
    private provider1: EmailProvider;
    private provider2: EmailProvider;
    private maxRetries: number;
    private rateLimit: number; // emails per minute
    private emailCache: Set<string>;
    private lastSentTime: number;

    constructor(provider1: EmailProvider, provider2: EmailProvider, maxRetries = 3, rateLimit = 10) {
        this.provider1 = provider1;
        this.provider2 = provider2;
        this.maxRetries = maxRetries;
        this.rateLimit = rateLimit;
        this.emailCache = new Set();
        this.lastSentTime = Date.now();
    }

    private async retryWithBackoff(fn: () => Promise<boolean>, retries = 0): Promise<boolean> {
        if (retries > this.maxRetries) return false;
        const success = await fn();
        if (!success) {
            const backoffTime = Math.pow(2, retries) * 1000; // Exponential backoff
            console.log(`Retrying in ${backoffTime}ms...`);
            await new Promise(resolve => setTimeout(resolve, backoffTime));
            return this.retryWithBackoff(fn, retries + 1);
        }
        return success;
    }

    private rateLimitCheck(): boolean {
        const now = Date.now();
        const timeElapsed = (now - this.lastSentTime) / 60000; // Convert to minutes
        const allowance = timeElapsed * this.rateLimit;
        if (allowance < 1) {
            console.log('Rate limit exceeded. Please wait.');
            return false;
        }
        this.lastSentTime = now;
        return true;
    }

    async sendEmail(to: string, subject: string, body: string): Promise<Status> {
        const emailKey = `${to}-${subject}-${body}`;
        if (this.emailCache.has(emailKey)) {
            console.log('Duplicate email detected. Aborting.');
            return { success: false, retries: 0, provider: '' };
        }

        if (!this.rateLimitCheck()) {
            return { success: false, retries: 0, provider: '' };
        }

        this.emailCache.add(emailKey);

        let success = await this.retryWithBackoff(() => this.provider1.sendEmail(to, subject, body));
        let provider = 'Provider1';
        let retries = this.maxRetries - 1;

        if (!success) {
            console.log('Provider1 failed. Switching to Provider2...');
            success = await this.retryWithBackoff(() => this.provider2.sendEmail(to, subject, body));
            provider = 'Provider2';
            retries += this.maxRetries;
        }

        return { success, retries, provider };
    }
}
