import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })

  const config = new DocumentBuilder()
    .setTitle('Kai Services')
    .setDescription('The kai API description')
    .setVersion('1.0')
    .addTag('kai')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, document)
  app.setGlobalPrefix('api')

  await app.listen(process.env.PORT || 2998)
}
bootstrap()
