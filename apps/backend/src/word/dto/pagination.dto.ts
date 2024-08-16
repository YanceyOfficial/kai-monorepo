import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator'

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

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  fromChallenging?: boolean

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  fromMarked?: boolean
}
