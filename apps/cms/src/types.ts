export interface Word {
  explanation: string
  phoneticNotation: string
  word: string
  examples: string[]
  _id: string
  score: number
}

export interface WordList {
  _id?: string
  title?: string
  words: Word[]
}

export interface WordListToChatGPTDto {
  words: string[]
}

export interface CreateWordListDto {
  words: Exclude<Word, '_id' | 'score'>
}

export type UpdateWordListDto = CreateWordListDto