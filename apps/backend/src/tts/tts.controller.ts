import { Controller, Post, Body } from '@nestjs/common';
import { TtsService } from './tts.service';

@Controller('tts')
export class TtsController {
  constructor(private readonly ttsService: TtsService) {}

  @Post()
  create(@Body() text: string) {
    return this.ttsService.create(text);
  }
}
