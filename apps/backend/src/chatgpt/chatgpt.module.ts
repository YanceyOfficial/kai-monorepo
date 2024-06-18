import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatgptService } from './chatgpt.service';
import { ChatgptController } from './chatgpt.controller';

@Module({
  controllers: [ChatgptController],
  providers: [ChatgptService, ConfigService],
})
export class ChatgptModule {}
