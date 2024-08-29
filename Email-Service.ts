// src/EmailService.ts
import { MockEmailProviderA } from './MockEmailProviderA';
import { MockEmailProviderB } from './MockEmailProviderB';

interface SendOptions {
  retries?: number;
  backoffFactor?: number;
}

export class EmailService {
  private primaryProvider: MockEmailProviderA;
  private secondaryProvider: MockEmailProviderB;
  private sentEmails: Set<string>;
  private rateLimit: number;
  private requestCount: number;
  private requestWindowStart: number;

  constructor() {
    this.primaryProvider = new MockEmailProviderA();
    this.secondaryProvider = new MockEmailProviderB();
    this.sentEmails = new Set<string>();
    this.rateLimit = 5; // Example rate limit: 5 emails per 10 seconds
    this.requestCount = 0;
    this.requestWindowStart = Date.now();
  }

  async sendEmail(email: string, options: SendOptions = {}): Promise<string> {
    const maxRetries = options.retries ?? 3;
    const backoffFactor = options.backoffFactor ?? 1000; // 1 second

    if (this.isRateLimited()) {
      return 'Rate limit exceeded. Try again later.';
    }

    if (this.sentEmails.has(email)) {
      return 'Duplicate email. Not sent.';
    }

    let provider = this.primaryProvider;
    let attempt = 0;

    while (attempt <= maxRetries) {
      attempt++;
      const success = await provider.send(email);

      if (success) {
        this.trackEmailStatus(email, 'Sent');
        this.sentEmails.add(email);
        return 'Email sent successfully.';
      }

      await this.backoff(attempt, backoffFactor);

      if (attempt === maxRetries && provider === this.primaryProvider) {
        provider = this.secondaryProvider;
        attempt = 0;
      }
    }

    this.trackEmailStatus(email, 'Failed');
    return 'Email sending failed after retries.';
  }

  private async backoff(attempt: number, backoffFactor: number): Promise<void> {
    const delay = Math.pow(2, attempt) * backoffFactor;
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  private isRateLimited(): boolean {
    const currentTime = Date.now();

    if (currentTime - this.requestWindowStart > 10000) {
      this.requestWindowStart = currentTime;
      this.requestCount = 0;
    }

    if (this.requestCount < this.rateLimit) {
      this.requestCount++;
      return false;
    }

    return true;
  }

  private trackEmailStatus(email: string, status: string) {
    console.log(`Email: ${email}, Status: ${status}`);
  }
}
