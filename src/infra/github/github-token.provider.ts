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
      const { accessToken } = await auth.api.getAccessToken({
        body: {
          userId,
        },
      });

      console.log('ACCESS TOKEN', accessToken);

      return accessToken ?? null;
    } catch {
      this.logger.warn(`Usuário ${userId} sem token do Github disponível`);
      return null;
    }
  }
}
