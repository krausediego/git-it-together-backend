import { GithubTokenProvider } from '@/infra/github/github-token.provider';
import { GithubUnauthorizedError } from '@/infra/github/github.errors';
import { http } from '@/infra/http';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(private readonly token: GithubTokenProvider) {}

  async getServices(userId: string, githubLogin?: string | null) {
    const userToken = await this.token.userToken(userId);

    if (!userToken) {
      throw new GithubUnauthorizedError();
    }

    const { data } = await http.get(`/users/${githubLogin}/events`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    return data;
  }
}
