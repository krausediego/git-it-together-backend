import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GithubClient } from './github.client';
import { GithubTokenProvider } from './github-token.provider';
import { GithubService } from './github.service';
import {
  GithubGetContributionsService,
  GithubGetProfileService,
} from './services';

@Module({
  imports: [ConfigModule],
  providers: [
    GithubClient,
    GithubTokenProvider,
    GithubService,
    GithubGetProfileService,
    GithubGetContributionsService,
  ],
  exports: [
    GithubTokenProvider,
    GithubGetProfileService,
    GithubGetContributionsService,
  ],
})
export class GithubModule {}
