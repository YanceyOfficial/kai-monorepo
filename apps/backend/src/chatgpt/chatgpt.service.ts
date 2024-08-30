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
    try {
      const { id, created, choices, usage } =
        await this.client.getChatCompletions(this.AZURE_OPENAI_DEPLOMENT_ID, [
          {
            role: 'system',
            content: `
You mission is to help me learn and review English words, I"ll give you a series of English words and phrases:

1. Generate a JSON format including Chinese explanation, american english pronunciation, syllabification, quizzes and at least 3 examples;
2. Pay attention to the fact that some words have different parts of speech, for example: the word "Eccentric" can function both as a noun and an adjective;
3. Generate at least 2 questions for each word or phrase in the form of single-choice, following the structure of the examples below.
3. Just return a pure JSON format text that can be used with JSON.parse(), do not return markdown triple backtick or other text description.

This is a example:

[
  {
      "name": "eccentric",
      "explanation": "adj. 怪异的，古怪的；异乎寻常的 / n. 行为古怪的人",
      "phoneticNotation": "/əbseʃ.ən/",
      "syllabification": ["ec", "cen", "tric"],
      "examples": [
          "He's always wanted to find his birth mother but recently it's become an obsession. 他一直想找到自己的生母，但最近这成了他的一块心病。",
          "My mother is something of an eccentric. 我妈妈有点古怪。"
      ],
      "quizzes": [
          {
              "type": "singleChoice",
              "question": "They are the problem families; they are the ____ of this world.",
              "choices": [
                  "eccentrics",
                  "workers",
                  "stonemasons",
                  "engineers"
              ],
              "answers": ["eccentrics"],
              "translation": "他们是问题家庭；他们是这个世界的怪人。"
          },
      ]
  },
  {
      "name": "roast",
      "explanation": "v. 烘，烤，焙；严厉批评；非难v吐槽（名人）/ adj. 烤制的 / n. 大块烤肉;（对名人的）吐槽",
      "phoneticNotation": "/roʊst/",
      "syllabification": ["roast"],
      "examples": [
          "Just roast the chicken in the oven and baste it in oil and lemon. 直接把鸡放在烤箱里烤，烤时涂上油和柠檬汁。",
          "Critics roasted him for exploiting racial stereotypes. 批评者抨击他利用了刻板的种族成见。",
          "He's known for roasting big-name celebrities on his Comedy Central shows. 他以在《喜剧中心》的节目上吐槽名人而出名。",
      ],
      "quizzes": [
          {
              "type": "singleChoice",
              "question": "I ____ the vegetables with some olive oil.",
              "choices": [
                  "grabbed",
                  "roasted",
                  "smoked",
                  "ate"
              ],
              "answers": ["roasted"],
              "translation": "我用一些橄榄油烤蔬菜。"
          },
      ]
  },
  {
      "name": "at somebody.'s disposal",
      "explanation": "听某人支配，可供某人使用",
      "phoneticNotation": "/æt səmˌbɑːdiz dɪˈspoʊzəl/",
      "syllabification": ["at", "somebody's", "disposal"],
      "examples": [
          "My Administration will continue to fight to make our communities safer, using every tool at our disposal to address this crisis. 我的政府将继续努力, 利用我们手头的每一个工具来解决这一危机,, 以使我们的社区更加安全."
      ],
      "quizzes": [
          {
              "type": "singleChoice",
              "question": "All the equipment will be ____ for the photo shoot.",
              "choices": [
                  "at our disposal",
                  "on the edge",
                  "out of pocket",
                  "at sb.'s fingertips"
              ],
              "answers": ["at our disposal"],
              "translation": "所有的设备将为拍摄提供支持。"
          }
      ]
  }
]
`
          },
          {
            role: 'user',
            content: words.join('; ')
          }
        ])

      return { id, created, choices, usage }
    } catch (e) {
      return e
    }
  }
}
