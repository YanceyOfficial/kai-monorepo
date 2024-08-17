import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { chunk } from 'lodash'
import { Model } from 'mongoose'
import { DEFAULT_FACTOR } from 'src/constants'
import { PaginationDto } from './dto/pagination.dto'
import { FactorAction, StatusDto } from './dto/status.dto'
import { UpdateWordListDto } from './dto/update-word.dto'
import { Statistics } from './interfaces/statistics.interface'
import { Word } from './word.schema'

@Injectable()
export class WordService {
  constructor(@InjectModel(Word.name) private wordModel: Model<Word>) {}

  public async findByPagination(pagination: PaginationDto) {
    const { page, pageSize } = pagination

    const total = (await this.wordModel.find()).length
    const items = await this.wordModel
      .find({})
      .sort({ createdAt: -1 })
      .skip(Number(page) * Number(pageSize))
      .limit(Number(pageSize))

    return {
      total,
      page: Number(page),
      pageSize: Number(pageSize),
      items
    }
  }

  public async getChallengingWords() {
    return this.wordModel.find().find({ factor: { $gte: DEFAULT_FACTOR } })
  }

  public async getStatistics(pageSize: number): Promise<Statistics> {
    const allWords = await this.wordModel.find().sort({ createdAt: -1 })
    const challengingCount = allWords.filter(
      (word) => word.factor > DEFAULT_FACTOR
    ).length

    return {
      challengingCount,
      items: chunk(allWords, pageSize).map((chunkedWords, i) => ({
        total: chunkedWords.length,
        page: i,
        learnedCount: chunkedWords.filter((words) => words.isLearned).length
      }))
    }
  }

  public async findOne(id: string) {
    return this.wordModel.find({ _id: id })
  }

  public async batchInsert(updateWordListDto: UpdateWordListDto) {
    return this.wordModel.insertMany(updateWordListDto.words)
  }

  public async updateOne(id: string, updateWordListDto: UpdateWordListDto) {
    return this.wordModel.findOneAndUpdate({ _id: id }, updateWordListDto)
  }

  public async setStatus(id: string, statusDto: StatusDto) {
    const { factor, isMarked } = await this.wordModel.findById(id)

    return this.wordModel.updateOne(
      { _id: id },
      {
        $set: {
          isLearned: true,
          factor:
            statusDto.action === FactorAction.Addition
              ? factor + 1
              : factor - 1,
          isMarked:
            typeof statusDto.isMarked === 'boolean'
              ? statusDto.isMarked
              : isMarked
        }
      }
    )
  }

  public async removeOne(id: string) {
    return this.wordModel.findByIdAndDelete(id)
  }
}
