# Pearl Thoughts
Task:
Implement a resilient email sending service in TypeScript/JavaScript.

Requirements:
1. Create an EmailService class that works with two mock email providers.
2. Implement retry logic with exponential backoff.
3. Add a fallback mechanism to switch providers on failure.
4. Ensure idempotency to prevent duplicate sends.
5. Implement basic rate limiting.
6. Provide status tracking for email sending attempts.

Key Features:
- Retry mechanism
- Fallback between providers
- Idempotency
- Rate limiting
- Status tracking

Bonus:
- Circuit breaker pattern
- Simple logging
- Basic queue system

## Email Service

## Overview
This is a simple email service implementation in TypeScript with the following features:
- Retry mechanism with exponential backoff
- Fallback between two mock providers
- Idempotency to prevent duplicate sends
- Basic rate limiting
- Status tracking for email sending attempts

## Setup
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Use `npm run build` to compile TypeScript files.
4. Use `npm test` to run the unit tests.

## Assumptions
- The email sending providers are mocked and do not actually send emails.
- Rate limiting is simplistic and assumes all emails are sent synchronously.
