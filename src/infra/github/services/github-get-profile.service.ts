import { Injectable, Logger } from '@nestjs/common';
import { GithubRequestOptions } from '../github.types';
import { GithubService } from '../github.service';
import { PROFILE_QUERY } from '../queries';
import { GithubNotFoundError } from '../github.errors';

export interface GithubProfile {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  createdAt: string;
  followers: number;
  following: number;
  publicRepos: number;
}

interface ProfileResponse {
  user: {
    login: string;
    name: string | null;
    avatarUrl: string;
    bio: string | null;
    company: string | null;
    location: string | null;
    createdAt: string;
    followers: { totalCount: number };
    following: { totalCount: number };
    repositories: { totalCount: number };
  } | null;
}

@Injectable()
export class GithubGetProfileService {
  private readonly logger = new Logger(GithubGetProfileService.name);

  constructor(private readonly githubService: GithubService) {}

  async getProfile(
    login: string,
    options?: GithubRequestOptions,
  ): Promise<GithubProfile> {
    const { user } = await this.githubService.run<ProfileResponse>(
      PROFILE_QUERY,
      { login },
      options,
    );

    if (!user) {
      throw new GithubNotFoundError(
        `Usuário ${login} não encontrado no GitHub`,
      );
    }

    return {
      login: user.login,
      name: user.name,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      company: user.company,
      location: user.location,
      createdAt: user.createdAt,
      followers: user.followers.totalCount,
      following: user.following.totalCount,
      publicRepos: user.repositories.totalCount,
    };
  }
}
