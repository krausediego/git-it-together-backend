import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export class ContributionQueryDto extends createZodDto(
  z.object({
    periodDays: z.coerce.number().int().min(1).max(365).default(30),
  }),
) {}

export class ContributionResponseDto extends createZodDto(
  z.object({
    totalContributions: z.number(),
    totalCommits: z.number(),
    totalPullRequests: z.number(),
    totalReviews: z.number(),
    totalIssues: z.number(),
    restrictedContributions: z.number(),
    days: z.array(z.object({ date: z.string(), count: z.number() })),
    currentStreak: z.number(),
    streakAtRisk: z.boolean(),
    longestStreak: z.number(),
  }),
) {}
