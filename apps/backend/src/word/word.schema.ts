import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, now } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export type WordDocument = HydratedDocument<WordList>

@Schema()
export class Word {
  @Prop({ required: true })
  word: string

  @Prop({ required: true })
  explanation: string

  @Prop({ required: true })
  phoneticNotation: string

  @Prop([String])
  examples: string[]

  @Prop()
  weightage: number

  @Prop()
  isMarked: boolean

  @Prop({ default: uuidv4 })
  _id: string
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

  @Prop({ default: now() })
  createdAt: Date

  @Prop({ default: now() })
  updatedAt: Date
}

export const WordListSchema = SchemaFactory.createForClass(WordList)
