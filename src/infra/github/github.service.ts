import { Injectable, Logger } from '@nestjs/common';
import { GithubRequestOptions } from './github.types';
import { GithubTokenProvider } from './github-token.provider';
import { GithubClient } from './github.client';
import {
  GithubUnauthorizedError,
  GithubUnavailableError,
} from './github.errors';

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);

  constructor(
    private readonly client: GithubClient,
    private readonly tokens: GithubTokenProvider,
  ) {}

  async run<T>(
    query: string,
    variables: Record<string, unknown>,
    options?: GithubRequestOptions,
  ): Promise<T> {
    if (options?.userId) {
      const userToken = await this.tokens.userToken(options.userId);

      if (userToken) {
        try {
          return await this.client.query<T>(query, variables, userToken);
        } catch (error) {
          if (!(error instanceof GithubUnauthorizedError)) throw error;
          this.logger.warn(
            `Token do usuário ${options.userId} recusado; usando token do app`,
          );
        }
      }
    }

    try {
      return await this.client.query<T>(
        query,
        variables,
        this.tokens.appToken(),
      );
    } catch (error) {
      if (error instanceof GithubUnauthorizedError) {
        this.logger.error('GITHUB_TOKEN do app foi recusado pelo GitHub');
        throw new GithubUnavailableError();
      }
      throw error;
    }
  }
}
