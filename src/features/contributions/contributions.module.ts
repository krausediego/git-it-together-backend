import { GithubModule } from '@/infra/github';
import { Module } from '@nestjs/common';
import { ContributionController } from './contributions.controller';
import { ContributionsService } from './contributions.service';

@Module({
  imports: [GithubModule],
  controllers: [ContributionController],
  providers: [ContributionsService],
})
export class ContributionModule {}
