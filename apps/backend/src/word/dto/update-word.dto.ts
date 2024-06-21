import { PartialType } from '@nestjs/swagger'
import { CreateWordListDto } from './create-word.dto'

export class UpdateWordListDto extends PartialType(CreateWordListDto) {}
