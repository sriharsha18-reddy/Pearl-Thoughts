export class MockEmailProviderB
{
    async send(email: string): Promise<boolean>
    {
      return Math.random() > 0.4;
    }
}