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
  factor: number
  isMarked: boolean
}

export interface WordListWithPagination {
  items: Word[]
  page: number
  pageSize: number
  total: number
}

export interface WordListToChatGPTDto {
  words: string[]
}

export interface CreateWordListDto {
  words: Exclude<Word, '_id' | 'factor' | 'isMarked'>
}

export type UpdateWordListDto = CreateWordListDto
