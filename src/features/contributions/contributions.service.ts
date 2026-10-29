import { toDateKey } from '@/helpers';
import { GithubGetContributionsService } from '@/infra/github/services';
import { Injectable } from '@nestjs/common';
import { calculateCurrentStreak, calculateLongestStreak } from './rules';

@Injectable()
export class ContributionsService {
  constructor(
    private readonly githubGetContributionService: GithubGetContributionsService,
  ) {}

  async getLastYear(login: string, userId: string) {
    const to = new Date();
    const from = new Date(to);

    from.setFullYear(to.getFullYear() - 1);

    const summary = await this.githubGetContributionService.getContributions(
      login,
      from,
      to,
      {
        userId,
      },
    );

    const today = toDateKey(new Date());
    const { current, atRisk } = calculateCurrentStreak(summary.days, today);
    const longest = calculateLongestStreak(summary.days);

    return {
      ...summary,
      currentStreak: current,
      streakAtRisk: atRisk,
      longestStreak: longest,
    };
  }
}
