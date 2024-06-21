import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard, ResourceGuard, RoleGuard } from 'nest-keycloak-connect'
import ConfigModule from 'src/config/config.module'
import { DataBaseModule } from 'src/database/database.module'
import { ChatgptModule } from './chatgpt/chatgpt.module'
import { AuthModule } from './guard/auth.module'
import { WordModule } from './word/word.module'

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    DataBaseModule,
    ChatgptModule,
    WordModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard
    }
  ]
})
export class AppModule {}
