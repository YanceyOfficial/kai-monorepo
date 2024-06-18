import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WordService } from './word.service';
import { WordController } from './word.controller';
import { WordList, WordListSchema } from './word.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WordList.name, schema: WordListSchema },
    ]),
  ],
  controllers: [WordController],
  providers: [WordService],
})
export class WordModule {}
