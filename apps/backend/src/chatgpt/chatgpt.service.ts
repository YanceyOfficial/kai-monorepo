import { createOpenAI, OpenAIProvider } from '@ai-sdk/openai'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { generateObject } from 'ai'
import { z } from 'zod'

@Injectable()
export class ChatgptService {
  private readonly openai: OpenAIProvider
  constructor(public configService: ConfigService) {
    this.openai = createOpenAI({
      apiKey: configService.get('OPENAI_KEY')
    })
  }

  public async create(words: string[]) {
    const result = await generateObject({
      model: this.openai('gpt-4o'),
      output: 'array',
      system: 'Given a list of English words and generate their word card.',
      prompt: words.filter((word) => word.trim() !== '').join('; '),
      schema: z.object({
        name: z.string().describe('The name of the word. e.g., eccentric'),
        explanation: z
          .string()
          .describe(
            'The Chinese description of the word e.g., adj. 怪异的，古怪的；异乎寻常的 / n. 行为古怪的人'
          ),
        phoneticNotation: z
          .string()
          .describe('The phonetic notation of the word. e.g., /əbseʃ.ən/'),
        syllabification: z
          .string()
          .array()
          .describe(
            'The syllabification of the word. e.g., ["ec", "cen", "tric"]'
          ),
        examples: z
          .string()
          .array()
          .describe(
            'The example sentences of the word, every piece includes English sentence and its Chinese translation, please generate at least 3 examples. e.g., ["He\'s always wanted to find his birth mother but recently it\'s become an obsession. 他一直想找到自己的生母，但最近这成了他的一块心病。", "My mother is something of an eccentric. 我妈妈有点古怪。"]'
          ),
        quizzes: z.array(
          z
            .object({
              type: z.literal('singleChoice').describe('Now only supports `singleChoice`'),
              question: z.string().describe('The question of the word. e.g., They are the problem families; they are the ____ of this world.'),
              choices: z.string().array().describe('The choices of the question. e.g., ["eccentrics", "workers", "stonemasons", "engineers"]'),
              answers: z.string().array().describe('The answers of the question, you should give an array that just includes one element, because we will support other types problem later. e.g., ["eccentrics"]'),
              translation: z.string().describe('The translation of the question. e.g., 他们是问题家庭；他们是这个世界的怪人。')
            })
            .describe('Several single-choice quizzes for interview. Please generate at least 3 quizzes for every word.')
        )
      })
    })

    return result.object
  }
}
