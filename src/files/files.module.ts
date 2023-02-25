import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  //*Para poder usar el ConfigService para poder tener acceso a las variables de entorno es necesario importar ConfigModule pero no para el .forRoot() como esta importado en app.module
  imports:[ConfigModule]
})
export class FilesModule {}
