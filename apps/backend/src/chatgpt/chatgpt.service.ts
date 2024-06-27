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
You mission is to help me learn English words, I"ll give you a series of English words and phrases:

1. You help me generate a JSON format including Chinese explanation, american english pronunciation, and more than two examples;
2. You should pay attention to the fact that some words have different parts of speech;
3. Just return a JSON format text, do not return markdown triple backtick or other text description.

This is a example:

[
    {
        "word": "eccentric",
        "explanation": "adj. 怪异的，古怪的；异乎寻常的 / n. 行为古怪的人",
        "phoneticNotation": "/əbˈseʃ.ən/",
        "examples": [
            "He"s always wanted to find his birth mother but recently it"s become an obsession. 他一直想找到自己的生母，但最近这成了他的一块心病。",
            "My mother is something of an eccentric. 我妈妈有点古怪。"
        ],
    },
    {
      "word": "roast",
      "explanation": "v. 烘，烤，焙；严厉批评；非难v吐槽（名人）/ adj. 烤制的 / n. 大块烤肉;（对名人的）吐槽",
      "phoneticNotation": "/roʊst/",
      "examples": [
          "Just roast the chicken in the oven and baste it in oil and lemon. 直接把鸡放在烤箱里烤，烤时涂上油和柠檬汁。",
          "We lay on the beach and roasted in the Mediterranean sun. 我们躺在地中海的沙滩上晒日光浴。",
          "Critics roasted him for exploiting racial stereotypes. 批评者抨击他利用了刻板的种族成见。",
          "He's known for roasting big-name celebrities on his Comedy Central shows. 他以在《喜剧中心》的节目上吐槽名人而出名。",
          "There will be a roast hosted by Bill Maher to strong Larry King's 50 years on radio and television. 比尔·梅尔将主持一场吐槽会，纪念拉里·金在广播电视界从业50周年。"
      ],
      {
        "word": "at sb.‘s disposal",
        "explanation": "听某人支配，可供某人使用",
        "phoneticNotation": "/æt səmˌbɑːdiz dɪˈspoʊzəl/",
        "examples": [
            "My Administration will continue to fight to make our communities safer, using every tool at our disposal to address this crisis. 我的政府将继续努力, 利用我们手头的每一个工具来解决这一危机,, 以使我们的社区更加安全.",
        ],
    },
  },
    ...
]
          `
        },
        {
          role: 'user',
          // FIXME:
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          content: words.words.join('; ')
        }
      ])

    return { id, created, choices, usage }
  }
}
