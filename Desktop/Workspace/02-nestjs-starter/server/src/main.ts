import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { TransformInterceptor } from './core/transform.interceptor'
import cookieParser from 'cookie-parser'
import { join } from 'path'
import { NestExpressApplication } from '@nestjs/platform-express'
import helmet from 'helmet'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const configService = app.get(ConfigService)

  const reflector = app.get(Reflector)
  // guards
  app.useGlobalGuards(new JwtAuthGuard(reflector))
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )

  //interceptor
  app.useGlobalInterceptors(new TransformInterceptor(reflector))
  //config cors
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
  })

  //config cookies
  app.use(cookieParser())

  app.useStaticAssets(join(__dirname, '..', 'public')) //js, css, images

  //versioning
  app.setGlobalPrefix('api')
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
  })

  //use helmet
  app.use(helmet())

  //config swagger
  const config = new DocumentBuilder()
    .setTitle('APIs Document for Job Finder')
    .setDescription('All apis modules')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'token',
    )
    .addSecurityRequirements('token')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })

  await app.listen(configService.get('PORT'))
}

bootstrap()
