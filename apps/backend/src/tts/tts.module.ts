import { Module } from '@nestjs/common';
import { TtsService } from './tts.service';
import { TtsController } from './tts.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [TtsController],
  providers: [TtsService, ConfigService],
})
export class TtsModule {}
