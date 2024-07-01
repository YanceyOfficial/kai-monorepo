export enum QuizType {
  SingleChoice = 'singleChoice',
  FillInBlank = 'fillInBlank'
}

export interface Quiz {
  _id: string
  answers: string[]
  choices: string[]
  question: string
  translation: string
  type: QuizType
}

export interface Word {
  _id: string
  name: string
  phoneticNotation: string
  syllabification: string
  explanation: string
  examples: string[]
  quizzes: Quiz[]
  weightage: number
  isMarked: boolean
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
  words: Exclude<Word, '_id' | 'weightage' | 'isMarked'>
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
