import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('My Car Value')
    .setDescription('The My Car Value API documentation')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('reports')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, document)

  await app.listen(process.env.PORT || 3000)
}
bootstrap()
