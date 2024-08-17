import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, Min } from 'class-validator'

export class PaginationDto {
  @ApiProperty({ required: true })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  page: number

  @ApiProperty({ required: true })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  pageSize: number
}
