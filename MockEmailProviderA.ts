export class MockEmailProviderA
{
    async send(email: string): Promise<boolean>
    {
      return Math.random() > 0.3;
    }
}