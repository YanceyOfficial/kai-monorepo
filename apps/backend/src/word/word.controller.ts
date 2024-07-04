import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common'
import { AuthenticatedUser } from 'nest-keycloak-connect'
import { Claims } from 'src/guard/types'
import { CreateWordListDto } from './dto/create-word.dto'
import { MarkDto } from './dto/mark.dto'
import { UpdateWordListDto } from './dto/update-word.dto'
import { WeightageDto } from './dto/weightage.dto'
import { WordService } from './word.service'

@Controller('word')
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @Post()
  public create(
    @Body() createWordListDto: CreateWordListDto,
    @AuthenticatedUser()
    user: Claims
  ) {
    return this.wordService.create(createWordListDto, user)
  }

  @Get()
  public findAll(
    @AuthenticatedUser()
    user: Claims
  ) {
    return this.wordService.findAll(user)
  }

  @Get(':id')
  public findOne(
    @Param('id') id: string,
    @AuthenticatedUser()
    user: Claims
  ) {
    return this.wordService.findOne(id, user)
  }

  @Get('/challenging')
  public getChallengingWords(
    @AuthenticatedUser()
    user: Claims
  ) {
    return this.wordService.getChallengingWords(user)
  }

  @Get('marked')
  public getMarkedWords(
    @AuthenticatedUser()
    user: Claims
  ) {
    return this.wordService.getMarkedWords(user)
  }

  @Post('/mark/:id/:wordId')
  public setIsMarked(
    @Param('id') id: string,
    @Param('wordId') wordId: string,
    @Body() markDto: MarkDto,
    @AuthenticatedUser()
    user: Claims
  ) {
    return this.wordService.setIsMarked(id, wordId, markDto.isMarked, user)
  }

  @Post('/weightage/:id/:wordId')
  public setWeightage(
    @Param('id') id: string,
    @Param('wordId') wordId: string,
    @Body() wightageDto: WeightageDto,
    @AuthenticatedUser()
    user: Claims
  ) {
    return this.wordService.setWeightage(id, wordId, wightageDto.action, user)
  }

  @Patch(':id')
  public update(
    @Param('id') id: string,
    @Body() updateWordListDto: UpdateWordListDto,
    @AuthenticatedUser()
    user: Claims
  ) {
    return this.wordService.update(id, updateWordListDto, user)
  }

  @Delete(':id')
  public remove(
    @Param('id') id: string,
    @AuthenticatedUser()
    user: Claims
  ) {
    return this.wordService.remove(id, user)
  }
}
