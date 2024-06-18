import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type WordDocument = HydratedDocument<WordList>;

@Schema()
export class Word {
  @Prop({ required: true })
  word: string;

  @Prop({ required: true })
  explanation: string;

  @Prop({ required: true })
  phoneticNotation: string;

  @Prop([String])
  examples: string[];

  @Prop()
  pronunciationUrl: string;
}

@Schema()
export class WordList {
  @Prop({ default: uuidv4 })
  _id: string;

  @Prop()
  title: string;

  @Prop([Word])
  words: Word[];

  @Prop({ required: true })
  userId: string;
}

export const WordListSchema = SchemaFactory.createForClass(WordList);
