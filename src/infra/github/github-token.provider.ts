import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { auth } from '@/infra/auth';

@Injectable()
export class GithubTokenProvider {
  private readonly logger = new Logger(GithubTokenProvider.name);

  constructor(private readonly config: ConfigService) {}

  appToken(): string {
    return this.config.getOrThrow<string>('GITHUB_TOKEN');
  }

  async userToken(userId: string): Promise<string | null> {
    try {
      const ctx = await auth.$context;
      const accounts = await ctx.internalAdapter.findAccounts(userId);
      const github = accounts.find(
        (account) => account.providerId === 'github',
      );

      if (!github) {
        return null;
      }

      const { accessToken } = await auth.api.getAccessToken({
        body: {
          accountId: github.id,
          userId,
        },
      });

      return accessToken ?? null;
    } catch {
      this.logger.warn(`Usuário ${userId} sem token do Github disponível`);
      return null;
    }
  }
}
