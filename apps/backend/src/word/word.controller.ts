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

@Controller('word')
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @Post()
  create(
    @Body() createWordListDto: CreateWordListDto,
    @AuthenticatedUser()
    user,
  ) {
    return this.wordService.create(createWordListDto, user);
  }

  @Get()
  findAll() {
    return this.wordService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wordService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWordListDto: UpdateWordListDto,
  ) {
    return this.wordService.update(+id, updateWordListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wordService.remove(+id);
  }
}
