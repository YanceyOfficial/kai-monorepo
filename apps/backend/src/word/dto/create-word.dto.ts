import { ApiProperty } from '@nestjs/swagger'

export class WordDto {
  @ApiProperty()
  word: string

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
