import { Controller, Get } from '@nestjs/common';
import { ContributionsService } from './contributions.service';
import { Session } from '@thallesp/nestjs-better-auth';
import { auth } from '@/infra/auth';
import { ApiTags } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';
import { ContributionResponseDto } from './contributions.dto';

type AppSession = typeof auth.$Infer.Session;

@ApiTags('contributions')
@Controller('contributions')
export class ContributionController {
  constructor(private readonly contributionsService: ContributionsService) {}

  @Get()
  @ZodResponse({ type: ContributionResponseDto })
  async getContributions(@Session() session: AppSession) {
    const { id, githubLogin } = session.user;

    const summary = await this.contributionsService.getLastYear(
      githubLogin!,
      id,
    );

    return summary;
  }
}
