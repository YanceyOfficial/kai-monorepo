import { ApiProperty } from '@nestjs/swagger'

export class RetrievalChatGptDto {
  @ApiProperty()
  words: string[]
}
