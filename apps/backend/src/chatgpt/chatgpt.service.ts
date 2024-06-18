import { Injectable } from '@nestjs/common';
import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChatgptService {
  private readonly client: OpenAIClient;
  private readonly AZURE_OPENAI_DEPLOMENT_ID: string;
  constructor(public configService: ConfigService) {
    this.client = new OpenAIClient(
      configService.get('AZURE_OPENAI_ENDPOINT'),
      new AzureKeyCredential(configService.get('AZURE_OPENAI_KEY')),
    );
    this.AZURE_OPENAI_DEPLOMENT_ID = configService.get(
      'AZURE_OPENAI_DEPLOMENT_ID',
    );
  }
  public async create(words: string[]) {
    const { id, created, choices, usage } =
      await this.client.getChatCompletions(this.AZURE_OPENAI_DEPLOMENT_ID, [
        {
          role: 'system',
          content: '',
        },
        {
          role: 'user',
          content: words.toString(),
        },
      ]);

    console.log(id, created, choices, usage);
    return 'This action adds a new chatgpt';
  }
}
