// src/EmailProvider.ts
export interface EmailProvider 
{
    sendEmail(to: string, subject: string, body: string): Promise<boolean>;
}
