import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { WordController } from './word.controller'
import { ChallengingWord, WordSchema } from './word.schema'
import { WordService } from './word.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChallengingWord.name, schema: WordSchema }
    ])
  ],
  controllers: [WordController],
  providers: [WordService]
})
export class WordModule {}
