// src/MockProvider1.ts
import { EmailProvider } from './EmailProvider';

export class MockProvider1 implements EmailProvider {
    async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
        // Simulate a successful send
        console.log(`MockProvider1: Sending email to ${to}`);
        return true;
    }
}

// src/MockProvider2.ts
import { EmailProvider } from './EmailProvider';

export class MockProvider2 implements EmailProvider {
    async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
        // Simulate a failed send
        console.log(`MockProvider2: Sending email to ${to}`);
        return Math.random() > 0.5; // Simulate random success or failure
    }
}
