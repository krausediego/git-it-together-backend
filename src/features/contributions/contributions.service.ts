import { GithubGetContributionsService } from '@/infra/github/services';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ContributionsService {
  constructor(
    private readonly githubGetContributionService: GithubGetContributionsService,
  ) {}

  getLastYear(login: string, userId: string) {
    const to = new Date();
    const from = new Date(to);

    from.setFullYear(to.getFullYear() - 1);

    return this.githubGetContributionService.getContributions(login, from, to, {
      userId,
    });
  }
}
