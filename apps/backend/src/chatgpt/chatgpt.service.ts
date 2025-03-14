import { createOpenAI, OpenAIProvider } from '@ai-sdk/openai'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { generateObject } from 'ai'
import { systemPrompt } from 'src/prompts'
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
      system: systemPrompt,
      prompt: words.filter((word) => word.trim() !== '').join('; '),
      schema: z.object({
        name: z.string(),
        explanation: z.string(),
        phoneticNotation: z.string(),
        syllabification: z.string().array(),
        examples: z.string().array(),
        quizzes: z.array(
          z.object({
            type: z.literal('singleChoice'),
            question: z.string(),
            choices: z.string().array(),
            answers: z.string().array(),
            translation: z.string()
          })
        )
      })
    })

    return result
  }
}
