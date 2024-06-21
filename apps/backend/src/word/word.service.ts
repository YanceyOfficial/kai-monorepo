import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Claims } from 'src/guard/types'
import { CreateWordListDto } from './dto/create-word.dto'
import { UpdateWordListDto } from './dto/update-word.dto'
import { WordList } from './word.schema'

@Injectable()
export class WordService {
  constructor(@InjectModel(WordList.name) private wordModel: Model<WordList>) {}

  public async create(createWordListDto: CreateWordListDto, user: Claims) {
    const count = await this.wordModel.countDocuments()
    const dto = {
      title: `Word List ${count + 1}`,
      words: createWordListDto.words.map((word) => ({ ...word, score: 5 })),
      userId: user?.sub
    }
    return this.wordModel.create(dto)
  }

  public async findAll(user: Claims) {
    return this.wordModel.find({ userId: user.sub })
  }

  public async findOne(id: string, user: Claims) {
    const wordList = await this.wordModel.findById(id)

    if (wordList.userId !== user.sub) {
      throw new NotFoundException()
    }

    return wordList
  }

  public async update(
    id: string,
    updateWordListDto: UpdateWordListDto,
    user: Claims
  ) {
    const wordList = await this.wordModel.findById(id)

    if (wordList.userId !== user.sub) {
      throw new NotFoundException()
    }

    return this.wordModel.findByIdAndUpdate(
      id,
      {
        updateWordListDto
      },
      { new: true }
    )
  }

  public async remove(id: string, user: Claims) {
    const wordList = await this.wordModel.findById(id)

    if (wordList.userId !== user.sub) {
      throw new NotFoundException()
    }

    return this.wordModel.findByIdAndDelete(id)
  }
}
