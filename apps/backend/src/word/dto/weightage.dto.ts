import { ApiProperty } from '@nestjs/swagger'

export class WeightageDto {
  @ApiProperty()
  weightage: number
}
