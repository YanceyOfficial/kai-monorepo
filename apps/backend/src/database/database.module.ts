import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { generateDatabaseURI } from 'src/utils'

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: generateDatabaseURI(configService),
        dbName: configService.get('DATABASE_COLLECTION')
      }),
      inject: [ConfigService]
    })
  ]
})
export class DataBaseModule {}
