import { Body, Controller, Post } from '@nestjs/common'
import { ChatgptService } from './chatgpt.service'
import { RetrievalChatGptDto } from './retrieval-chatgpt.dto'

@Controller('chatgpt')
export class ChatgptController {
  constructor(private readonly chatgptService: ChatgptService) {}

  @Post()
  create(@Body() retrievalChatGptDto: RetrievalChatGptDto) {
    return this.chatgptService.create(retrievalChatGptDto.words)
  }
}
