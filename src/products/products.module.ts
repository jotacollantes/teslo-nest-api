import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product,ProductImage } from './entities';


@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports:[
    //*Importamos el typeOrm como forFeature
    TypeOrmModule.forFeature(
      [
        //*Importamos la entidad Product definida en product.entity.ts
        Product,
        ProductImage
      ]
    )
  ],
//*Exportamos el ProductsService para para que el modulo seed pueda usar el metodo deleteAllProducts y el typeOrmMOdule para poder usar los repositorios Products y ProductImages
exports:[ProductsService,TypeOrmModule]


})
export class ProductsModule {}
