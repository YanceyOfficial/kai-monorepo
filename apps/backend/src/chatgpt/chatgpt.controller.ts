import { Body, Controller, Post } from '@nestjs/common'
import { ChatgptService } from './chatgpt.service'

@Controller('chatgpt')
export class ChatgptController {
  constructor(private readonly chatgptService: ChatgptService) {}

  @Post()
  create(@Body() words: string[]) {
    return this.chatgptService.create(words)
  }
}
