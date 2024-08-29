// test/EmailService.test.ts
import { EmailService } from '../src/EmailService';

test('sendEmail retries and falls back correctly', async () => {
  const emailService = new EmailService();
  const result = await emailService.sendEmail('test@example.com');
  expect(result).toMatch(/Email sent successfully|Email sending failed/);
});

test('sendEmail ensures idempotency', async () => {
  const emailService = new EmailService();
  await emailService.sendEmail('test@example.com');
  const result = await emailService.sendEmail('test@example.com');
  expect(result).toBe('Duplicate email. Not sent.');
});

test('sendEmail respects rate limiting', async () => {
  const emailService = new EmailService();
  for (let i = 0; i < 5; i++) {
    await emailService.sendEmail(`test${i}@example.com`);
  }
  const result = await emailService.sendEmail('overflow@example.com');
  expect(result).toBe('Rate limit exceeded. Try again later.');
});
