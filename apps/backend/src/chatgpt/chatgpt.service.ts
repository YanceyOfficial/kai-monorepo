import { AzureKeyCredential, OpenAIClient } from '@azure/openai'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class ChatgptService {
  private readonly client: OpenAIClient
  private readonly AZURE_OPENAI_DEPLOMENT_ID: string
  constructor(public configService: ConfigService) {
    this.client = new OpenAIClient(
      configService.get('AZURE_OPENAI_ENDPOINT'),
      new AzureKeyCredential(configService.get('AZURE_OPENAI_KEY'))
    )
    this.AZURE_OPENAI_DEPLOMENT_ID = configService.get(
      'AZURE_OPENAI_DEPLOMENT_ID'
    )
  }
  public async create(words: string[]) {
    const { id, created, choices, usage } =
      await this.client.getChatCompletions(this.AZURE_OPENAI_DEPLOMENT_ID, [
        {
          role: 'system',
          content: `
You mission is to help me learn English words, I"ll give you a series of English words and phrases, 
you help me generate a JSON format including Chinese explanation, examples, american english pronunciation.
You should pay attention to the fact that some words have different parts of speech.
Just return a JSON format text, do not return markdown triple backtick or other text description.
This is a example:

[
    {
        "word": "awareness",
        "explanation": "n. 意识",
        "phoneticNotation": "/əˈwer.nəs/",
        "examples": [
            "Public awareness of the problem will make politicians take it seriously. 一旦公众意识到这个问题，政客们就会严肃对待它了。 ",
            "Environmental awareness has increased dramatically over the past decade. 在过去的10年中，环保意识明显增强。"
        ],
    },
    {
        "word": "eccentric",
        "explanation": "adj. 怪异的，古怪的；异乎寻常的 / n. 行为古怪的人",
        "phoneticNotation": "/əbˈseʃ.ən/",
        "examples": [
            "He"s always wanted to find his birth mother but recently it"s become an obsession. 他一直想找到自己的生母，但最近这成了他的一块心病。",
            "My mother is something of an eccentric. 我妈妈有点古怪。"
        ],
    }
    ...
]
          `
        },
        {
          role: 'user',
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          content: words.words.join('; ')
        }
      ])

    return { id, created, choices, usage }
  }
}
