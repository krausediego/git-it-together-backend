import { Injectable } from '@nestjs/common';
import { GithubRequestOptions } from '../github.types';
import { GithubInvalidRangeError, GithubNotFoundError } from '../github.errors';
import { GithubService } from '../github.service';
import { CONTRIBUTIONS_QUERY } from '../queries';

export interface ContributionDay {
  date: string; // 'YYYY-MM-DD'
  count: number;
}

export interface ContributionsSummary {
  totalContributions: number;
  totalCommits: number;
  totalPullRequests: number;
  totalReviews: number;
  totalIssues: number;
  restrictedContributions: number; // contribuições privadas (só o número)
  days: ContributionDay[];
}

interface ContributionsResponse {
  user: {
    contributionsCollection: {
      totalCommitContributions: number;
      totalPullRequestContributions: number;
      totalPullRequestReviewContributions: number;
      totalIssueContributions: number;
      restrictedContributionsCount: number;
      contributionCalendar: {
        totalContributions: number;
        weeks: {
          contributionDays: { date: string; contributionCount: number }[];
        }[];
      };
    };
  } | null;
}

@Injectable()
export class GithubGetContributionsService {
  private readonly ONE_YEAR_MS = 366 * 24 * 60 * 60 * 1000;

  constructor(private readonly githubService: GithubService) {}

  async getContributions(
    login: string,
    from: Date,
    to: Date,
    options?: GithubRequestOptions,
  ): Promise<ContributionsSummary> {
    if (to.getTime() - from.getTime() > this.ONE_YEAR_MS) {
      throw new GithubInvalidRangeError();
    }

    const { user } = await this.githubService.run<ContributionsResponse>(
      CONTRIBUTIONS_QUERY,
      { login, from: from.toISOString(), to: to.toISOString() },
      options,
    );

    if (!user) {
      throw new GithubNotFoundError(
        `Usuário ${login} não encontrado no GitHub`,
      );
    }

    return {
      totalContributions:
        user.contributionsCollection.contributionCalendar.totalContributions,
      totalCommits: user.contributionsCollection.totalCommitContributions,
      totalPullRequests:
        user.contributionsCollection.totalPullRequestContributions,
      totalReviews:
        user.contributionsCollection.totalPullRequestReviewContributions,
      totalIssues: user.contributionsCollection.totalIssueContributions,
      restrictedContributions:
        user.contributionsCollection.restrictedContributionsCount,
      days: user.contributionsCollection.contributionCalendar.weeks
        .flatMap((week) => week.contributionDays)
        .map((day) => ({ date: day.date, count: day.contributionCount })),
    };
  }
}
