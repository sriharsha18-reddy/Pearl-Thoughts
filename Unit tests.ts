// test/EmailService.test.ts
import { EmailService } from '../src/EmailService';
import { MockProvider1 } from '../src/MockProvider1';
import { MockProvider2 } from '../src/MockProvider2';

test('EmailService should send email via Provider1', async () => {
    const service = new EmailService(new MockProvider1(), new MockProvider2());
    const status = await service.sendEmail('test@example.com', 'Test Subject', 'Test Body');
    expect(status.success).toBe(true);
    expect(status.provider).toBe('Provider1');
});

test('EmailService should fallback to Provider2 if Provider1 fails', async () => {
    const service = new EmailService(new MockProvider2(), new MockProvider1());
    const status = await service.sendEmail('test@example.com', 'Test Subject', 'Test Body');
    expect(status.provider).toBe('Provider2');
});
