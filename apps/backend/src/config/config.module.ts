import { ConfigModule } from '@nestjs/config'

export default ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: '.env'
})
