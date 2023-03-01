import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './auth/auth.module';

@Module({
  
  imports: [
    //* 1. Configuracion de las variables de entorno con ConfigModule
    ConfigModule.forRoot(),
    //* 2. Configuracion del modulo TYPEORM for Root
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities:true,
      //*Ejecuta los cambios en las entities de manera inmediata en la BD
      synchronize:true,

    }),
    //*Desplegamos el contenido estatico que esta en la carpeta /public
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'), 
    }),
    ProductsModule,
    CommonModule,
    SeedModule,
    FilesModule,
    AuthModule
  ],

  
  controllers: [],
  providers: [],
})
export class AppModule {}
