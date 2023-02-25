import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from 'src/products/products.module';


@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports:[
    //*Importamos todo lo que se exporta en ProductsModule
    //!En los importes siempre deben de ir los modulos y no las clases que incluyen los decoradores @Injectable() o @Controller
    ProductsModule
  ],
})
export class SeedModule {}
