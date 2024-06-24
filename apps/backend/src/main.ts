import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { configCORS } from './cors'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: configCORS(process.env.NODE_ENV === 'production')
  })

  const config = new DocumentBuilder()
    .setTitle('Kai Services')
    .setDescription('The kai API description')
    .setVersion('1.0')
    .addTag('kai')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(process.env.PORT || 2998)
}
bootstrap()
