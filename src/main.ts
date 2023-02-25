import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {

  const logger = new Logger('bootstrap')
  const app = await NestFactory.create(AppModule);
  //*Configuramos el prefix para el api rest
  app.setGlobalPrefix('api')

  //*Configuramos de manera global el uso de pipes
  app.useGlobalPipes(  
    new ValidationPipe({ 
      whitelist: true, 
      forbidNonWhitelisted: true, 
    }) 
  );

  await app.listen(process.env.PORT);
  logger.log(`Listen on Port: ${process.env.PORT}`)
}
bootstrap();
