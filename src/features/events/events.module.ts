import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { GithubModule } from '@/infra/github';

@Module({
  imports: [GithubModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
