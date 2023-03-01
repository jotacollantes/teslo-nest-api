import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product,ProductImage } from './entities';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports:[
    //*Importamos el typeOrm como forFeature donde se creara la tabla products en la base de datos
    TypeOrmModule.forFeature(
      [
        //*Importamos la entidad Product definida en product.entity.ts
        Product,
        ProductImage
      ]
    ),AuthModule
  ],
//*Exportamos el ProductsService para para que el modulo seed pueda usar el metodo deleteAllProducts y el typeOrmMOdule para poder usar los repositorios Products y ProductImages
exports:[ProductsService,TypeOrmModule]


})
export class ProductsModule {}
