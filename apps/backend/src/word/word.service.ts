import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { chunk } from 'lodash'
import { Model } from 'mongoose'
import { DEFAULT_FACTOR } from 'src/constants'
import { CreateWordListDto } from './dto/create-word.dto'
import { PaginationDto } from './dto/pagination.dto'
import { FactorAction, StatusDto } from './dto/status.dto'
import { UpdateWordDto } from './dto/update-word.dto'
import { Statistics } from './interfaces/statistics.interface'
import { Word } from './word.schema'

@Injectable()
export class WordService {
  constructor(@InjectModel(Word.name) private wordModel: Model<Word>) {}

  public async deduplicate() {
    const duplicates = await this.wordModel.aggregate([
      {
        $group: {
          _id: '$name',
          count: { $sum: 1 },
          ids: { $push: '$_id' }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ])

    let idsToDelete = []
    duplicates.forEach((group) => {
      idsToDelete = idsToDelete.concat(group.ids.slice(1))
    })

    return this.wordModel.deleteMany({
      _id: { $in: idsToDelete }
    })
  }

  public async findByPagination(pagination: PaginationDto) {
    const { page, pageSize, search } = pagination

    const total = await this.wordModel.countDocuments()
    const items = await this.wordModel
      .distinct('name')
      .find({
        name: { $regex: !search ? '' : search, $options: 'i' }
      })
      .sort({ createdAt: 1 })
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
    const allWords = await this.wordModel.find().sort({ createdAt: 1 })
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

  public async batchInsert(createWordListDto: CreateWordListDto) {
    return this.wordModel.insertMany(createWordListDto.words)
  }

  public async updateOne(updateWordDto: UpdateWordDto) {
    return this.wordModel.findOneAndUpdate(
      { _id: updateWordDto._id },
      updateWordDto
    )
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
