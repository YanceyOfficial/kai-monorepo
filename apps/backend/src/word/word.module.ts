import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { WordController } from './word.controller'
import { WordSchema } from './word.schema'
import { WordService } from './word.service'

@Module({
  imports: [
    // MongooseModule.forFeature([{ name: Word.name, schema: WordSchema }])
    // MongooseModule.forFeature([{ name: 'toeic_word', schema: WordSchema }])
    MongooseModule.forFeature([{ name: 'ielts_word', schema: WordSchema }])
  ],
  controllers: [WordController],
  providers: [WordService]
})
export class WordModule {}
