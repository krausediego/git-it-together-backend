import { Injectable, Logger } from '@nestjs/common';
import {
  GithubNotFoundError,
  GithubRateLimitError,
  GithubUnauthorizedError,
  GithubUnavailableError,
} from './github.errors';

interface GraphqlError {
  message: string;
  type?: string;
}

interface GraphqlResponse<T> {
  data?: T;
  errors?: GraphqlError[];
}

@Injectable()
export class GithubClient {
  private readonly logger = new Logger(GithubClient.name);
  private readonly endpoint = 'https://api.github.com/graphql';

  async query<T>(
    query: string,
    variables: Record<string, unknown> = {},
    token: string,
  ): Promise<T> {
    let response: Response;

    try {
      response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
        signal: AbortSignal.timeout(10_000),
      });

      this.logger.debug(
        `token=${token.slice(0, 4)}… scopes=${response.headers.get('x-oauth-scopes') ?? '(nenhum)'}`,
      );
    } catch (error) {
      this.logger.error('Falha de rede ao chamar o Github', error);
      throw new GithubUnavailableError();
    }

    if (response.status === 401) {
      throw new GithubUnauthorizedError();
    }
    if (response.status === 403 || response.status === 429) {
      throw new GithubRateLimitError();
    }

    if (!response.ok) {
      this.logger.error(`Github respondeu HTTP ${response.status}`);
      throw new GithubUnavailableError();
    }

    const body = (await response.json()) as GraphqlResponse<T>;

    if (body.errors?.length) {
      const [first] = body.errors;

      if (first.type === 'NOT_FOUND') {
        throw new GithubNotFoundError(first.message);
      }
      if (first.type === 'RATE_LIMITED') {
        throw new GithubRateLimitError();
      }

      this.logger.error(`Erro GraphQL: ${first.message}`);
      throw new GithubUnavailableError();
    }

    return body.data as T;
  }
}
