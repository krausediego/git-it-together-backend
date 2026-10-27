import { Controller, Get } from '@nestjs/common';
import { ContributionsService } from './contributions.service';
import { Session } from '@thallesp/nestjs-better-auth';
import { auth } from '@/infra/auth';

type AppSession = typeof auth.$Infer.Session;

@Controller('contributions')
export class ContributionController {
  constructor(private readonly contributionsService: ContributionsService) {}

  @Get()
  async getContributions(@Session() session: AppSession) {
    const { id, githubLogin } = session.user;

    console.log(githubLogin);

    return this.contributionsService.getLastYear(githubLogin!, id);
  }
}
