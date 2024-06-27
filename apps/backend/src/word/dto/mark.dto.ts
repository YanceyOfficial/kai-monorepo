import { ApiProperty } from '@nestjs/swagger'

export class MarkDto {
  @ApiProperty()
  isMarked: boolean
}
