import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { PaginationDto } from './dto/pagination.dto'
import { StatusDto } from './dto/status.dto'
import { UpdateWordListDto } from './dto/update-word.dto'
import { WordService } from './word.service'

@Controller('word')
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @Get()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true }
    })
  )
  public findByPagination(@Query() pagination: PaginationDto) {
    return this.wordService.findByPagination(pagination)
  }

  @Get('/statistics')
  public getStatistics(@Query('pageSize') pageSize: number) {
    return this.wordService.getStatistics(pageSize)
  }

  @Get('/challenging')
  public getChallengingWords() {
    return this.wordService.getChallengingWords()
  }

  @Post()
  public batchInsert(@Body() updateWordListDto: UpdateWordListDto) {
    return this.wordService.batchInsert(updateWordListDto)
  }

  @Get('/:id')
  public findOne(@Param('id') id: string) {
    return this.wordService.findOne(id)
  }

  @Post('/status/:id')
  public setStatus(@Param('id') id: string, @Body() statusDto: StatusDto) {
    return this.wordService.setStatus(id, statusDto)
  }

  @Patch(':id')
  public updateOne(
    @Param('id') id: string,
    @Body() updateWordListDto: UpdateWordListDto
  ) {
    return this.wordService.updateOne(id, updateWordListDto)
  }

  @Delete(':id')
  public removeOne(@Param('id') id: string) {
    return this.wordService.removeOne(id)
  }
}
