import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import ConfigModule from 'src/config/config.module';
import { DataBaseModule } from 'src/database/database.module';
import { ChatgptModule } from './chatgpt/chatgpt.module';
import { TtsModule } from './tts/tts.module';
import { WordModule } from './word/word.module';

@Module({
  imports: [ConfigModule, DataBaseModule, ChatgptModule, TtsModule, WordModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
