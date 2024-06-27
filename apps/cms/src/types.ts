export interface Word {
  explanation: string
  phoneticNotation: string
  word: string
  examples: string[]
  _id: string
  weightage: number
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
  words: Exclude<Word, '_id' | 'weightage'>
}

export type UpdateWordListDto = CreateWordListDto

export interface ChatCompletion {
  id: string
  created: number
  model: string
  choices: {
    text: string
    index: number
    logprobs: Record<string, unknown>
    finish_reason: string
    message: {
      content: string
    }
  }[]
}
