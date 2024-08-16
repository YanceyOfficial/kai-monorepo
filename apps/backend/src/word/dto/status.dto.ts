import { ApiProperty } from '@nestjs/swagger'

export enum FactorAction {
  Addition,
  Subtraction
}

export enum MarkAction {
  Mark,
  Quit
}

export class StatusDto {
  @ApiProperty()
  action: FactorAction

  @ApiProperty()
  isMarked?: boolean
}
