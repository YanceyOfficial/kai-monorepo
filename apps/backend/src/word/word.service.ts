import { Injectable } from '@nestjs/common';
import { CreateWordListDto } from './dto/create-word.dto';
import { UpdateWordListDto } from './dto/update-word.dto';
import { WordList } from './word.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class WordService {
  constructor(@InjectModel(WordList.name) private wordModel: Model<WordList>) {}

  create(createWordListDto: CreateWordListDto) {
    return this.wordModel.create(createWordListDto);
  }

  findAll() {
    return this.wordModel.find();
  }

  findOne(id: number) {
    return this.wordModel.findById(id);
  }

  update(id: number, updateWordListDto: UpdateWordListDto) {
    return this.wordModel.findByIdAndUpdate(
      id,
      {
        updateWordListDto,
      },
      { new: true },
    );
  }

  remove(id: number) {
    return this.wordModel.findByIdAndDelete(id);
  }
}
