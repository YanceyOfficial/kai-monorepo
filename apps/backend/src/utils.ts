import { ConfigService } from '@nestjs/config'

export const generateDatabaseURI = (configService: ConfigService) => {
  const host = configService.get('DATABASE_HOST')
  const port = configService.get('DATABASE_PORT')
  const userName = configService.get('DATABASE_USER')
  const userPwd = configService.get('DATABASE_PWD')
  const dbName = configService.get('DATABASE_COLLECTION')

  const prefix = 'mongodb://'
  const auth = `${userName}:${userPwd}`
  const connection = `${host}:${port}`

  return `${prefix}${auth}@${connection}/${dbName}`
}
