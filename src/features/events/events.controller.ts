import { Controller, Get } from '@nestjs/common';
import { EventsService } from './events.service';
import { Session } from '@thallesp/nestjs-better-auth';
import type { AppSession } from '@/types';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async getServices(@Session() session: AppSession) {
    const { user } = session;

    const events = await this.eventsService.getServices(
      user.id,
      user.githubLogin,
    );

    return events;
  }
}
