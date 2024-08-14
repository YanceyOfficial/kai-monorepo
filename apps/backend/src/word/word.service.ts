import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { DEFAULT_WEIGHTAGE } from 'src/constants'
import { Claims } from 'src/guard/types'
import { CreateWordListDto } from './dto/create-word.dto'
import { UpdateWordListDto } from './dto/update-word.dto'
import { WeightageAction } from './dto/weightage.dto'
import { WordList } from './word.schema'

@Injectable()
export class WordService {
  constructor(@InjectModel(WordList.name) private wordModel: Model<WordList>) {}

  public async create(createWordListDto: CreateWordListDto, user: Claims) {
    const count = await this.wordModel.countDocuments()
    const dto = {
      title: `Word List ${count + 1}`,
      words: createWordListDto.words.map((word) => ({ ...word, weightage: 5 })),
      userId: user?.sub
    }
    return this.wordModel.create(dto)
  }

  public async findAll(user: Claims) {
    const wordList = await this.wordModel.find({ userId: user.sub })

    return wordList.map((item) => {
      const { words, ...rest } = item.toObject()

      return {
        ...rest,
        wordCount: words.length
      }
    })
  }

  public async findOne(id: string, user: Claims) {
    const wordList = await this.wordModel.findById(id)

    if (wordList.userId !== user.sub) {
      throw new NotFoundException()
    }

    return wordList
  }

  public async getChallengingWords(id: string, user: Claims) {
    const { words } = await this.findOne(id, user)

    return {
      title: 'Challenging Words',
      words: words.filter((word) => word.weightage > DEFAULT_WEIGHTAGE)
    }
  }

  public async getMarkedWords(id: string, user: Claims) {
    const { words } = await this.findOne(id, user)

    return {
      title: 'Marked Words',
      words: words.filter((word) => word.isMarked)
    }
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

    return this.wordModel.findByIdAndUpdate(id, updateWordListDto, {
      new: true,
      upsert: true
    })
  }

  public async setIsMarked(
    wordListId: string,
    wordId: string,
    isMarked: boolean,
    user: Claims
  ) {
    const wordList = await this.wordModel.findById(wordListId)

    if (wordList.userId !== user.sub) {
      throw new NotFoundException()
    }

    return this.wordModel.updateOne(
      { _id: wordListId, 'words._id': wordId },
      { $set: { 'words.$.isMarked': isMarked } },
      {
        new: true
      }
    )
  }

  public async setWeightage(
    wordListId: string,
    wordId: string,
    action: WeightageAction,
    user: Claims
  ) {
    const wordList = await this.wordModel.findById(wordListId)

    if (wordList.userId !== user.sub) {
      throw new NotFoundException()
    }

    const weightage =
      wordList.toObject().words.find((word) => word._id === wordId)
        ?.weightage || DEFAULT_WEIGHTAGE

    return this.wordModel.updateOne(
      { _id: wordListId, 'words._id': wordId },
      {
        $set: {
          'words.$.weightage':
            action === WeightageAction.Addiation ? weightage + 1 : weightage - 1
        }
      },
      {
        new: true
      }
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
