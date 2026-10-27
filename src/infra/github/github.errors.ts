import {
  BadRequestException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';

export class GithubNotFoundError extends NotFoundException {
  constructor(message = 'Recurso não encontrado no GitHub') {
    super(message);
  }
}

export class GithubRateLimitError extends ServiceUnavailableException {
  constructor() {
    super(
      'Limite de requisições do GitHub atingido. Tente novamente mais tarde.',
    );
  }
}

export class GithubUnavailableError extends ServiceUnavailableException {
  constructor(message = 'Não foi possível se comunicar com o GitHub') {
    super(message);
  }
}

/** O GitHub recusou o token (revogado, expirado ou inválido). */
export class GithubUnauthorizedError extends UnauthorizedException {
  constructor() {
    super(
      'O acesso ao GitHub foi revogado. Faça login novamente com o GitHub.',
    );
  }
}

export class GithubInvalidRangeError extends BadRequestException {
  constructor() {
    super('O intervalo de contribuições não pode passar de 1 ano.');
  }
}
