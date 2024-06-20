import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WordService } from './word.service';
import { CreateWordListDto } from './dto/create-word.dto';
import { UpdateWordListDto } from './dto/update-word.dto';
import { AuthenticatedUser } from 'nest-keycloak-connect';
import { Claims } from 'src/guard/types';

@Controller('word')
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @Post()
  create(
    @Body() createWordListDto: CreateWordListDto,
    @AuthenticatedUser()
    user: Claims,
  ) {
    return this.wordService.create(createWordListDto, user);
  }

  @Get()
  findAll(
    @AuthenticatedUser()
    user: Claims,
  ) {
    return this.wordService.findAll(user);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @AuthenticatedUser()
    user: Claims,
  ) {
    return this.wordService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWordListDto: UpdateWordListDto,
    @AuthenticatedUser()
    user: Claims,
  ) {
    return this.wordService.update(id, updateWordListDto, user);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @AuthenticatedUser()
    user: Claims,
  ) {
    return this.wordService.remove(id, user);
  }
}
