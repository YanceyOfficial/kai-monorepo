import { Injectable } from '@nestjs/common';
import { CreateWordListDto } from './dto/create-word.dto';
import { UpdateWordListDto } from './dto/update-word.dto';
import { WordList } from './word.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class WordService {
  constructor(@InjectModel(WordList.name) private wordModel: Model<WordList>) {}

  async create(createWordListDto: CreateWordListDto, user) {
    const count = await this.wordModel.countDocuments();
    const dto = {
      title: `Word List ${count + 1}`,
      words: createWordListDto.words.map((word) => ({ ...word, score: 5 })),
      userId: user?.userId,
    };
    return this.wordModel.create(dto);
  }

  findAll() {
    return this.wordModel.find();
  }

  findOne(id: string) {
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
