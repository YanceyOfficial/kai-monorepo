import { ApiProperty } from '@nestjs/swagger'

export enum WeightageAction {
  Addiation,
  Substract
}

export class WeightageDto {
  @ApiProperty()
  action: WeightageAction
}
