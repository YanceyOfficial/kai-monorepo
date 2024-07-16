import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { DEFAULT_WEIGHTAGE } from 'src/constants'
import { v4 as uuidv4 } from 'uuid'

export type WordDocument = HydratedDocument<WordList>

export enum QuizType {
  SingleChoice = 'singleChoice',
  FillInBlank = 'fillInBlank'
}

@Schema()
export class Quiz {
  @Prop({ default: uuidv4 })
  _id: string

  @Prop({ required: true })
  question: string

  @Prop({ required: true })
  type: QuizType

  @Prop({ type: [String], required: false })
  choices?: string[]

  @Prop({ type: [String], required: true })
  answers: string[]

  @Prop({ required: true })
  translation: string
}

@Schema()
export class Word {
  @Prop({ default: uuidv4 })
  _id: string

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  explanation: string

  @Prop({ required: true })
  phoneticNotation: string

  @Prop({ type: [String], required: true })
  syllabification: string[]

  @Prop([String])
  examples: string[]

  @Prop([Quiz])
  quizzes: Quiz[]

  @Prop({ default: DEFAULT_WEIGHTAGE })
  weightage: number

  @Prop({ default: false })
  isMarked: boolean
}

@Schema({ timestamps: true })
export class WordList {
  @Prop({ default: uuidv4 })
  _id: string

  @Prop()
  title: string

  @Prop([Word])
  words: Word[]

  @Prop()
  userId: string

  @Prop({ efault: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const WordListSchema = SchemaFactory.createForClass(WordList)
