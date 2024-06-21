import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { WordController } from './word.controller'
import { WordList, WordListSchema } from './word.schema'
import { WordService } from './word.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: WordList.name, schema: WordListSchema }])
  ],
  controllers: [WordController],
  providers: [WordService]
})
export class WordModule {}
