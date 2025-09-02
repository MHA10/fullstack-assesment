import { Module } from '@nestjs/common';

import { EmailModule } from '../email/email.module';
import { MessagingService } from './messaging.service';

@Module({
  imports: [EmailModule],
  controllers: [MessagingService],
  providers: [MessagingService],
  exports: [MessagingService],
})
export class MessagingModule {}
