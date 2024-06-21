import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ChatgptController } from './chatgpt.controller'
import { ChatgptService } from './chatgpt.service'

@Module({
  controllers: [ChatgptController],
  providers: [ChatgptService, ConfigService]
})
export class ChatgptModule {}
