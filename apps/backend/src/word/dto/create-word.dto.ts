import { ApiProperty } from '@nestjs/swagger'
import { QuizType } from '../word.schema'

export class Quiz {
  @ApiProperty()
  _id: string

  @ApiProperty()
  question: string

  @ApiProperty()
  type: QuizType

  @ApiProperty()
  choices?: string[]

  @ApiProperty()
  answers: string[]

  @ApiProperty()
  translation: string
}

export class WordDto {
  @ApiProperty()
  name: string

  @ApiProperty()
  explanation: string

  @ApiProperty()
  phoneticNotation: string

  @ApiProperty()
  examples: string[]
}

export class CreateWordListDto {
  @ApiProperty()
  words: WordDto[]
}
