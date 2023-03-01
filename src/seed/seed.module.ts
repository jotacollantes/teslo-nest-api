import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from 'src/products/products.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports:[
    //*Importamos todo lo que se exporta en ProductsModule
    //!En los imports siempre deben de ir los modulos y no las clases que incluyen los decoradores @Injectable() o @Controller
    ProductsModule,
    //*Importamos todo el AuthModule para poder usar el decorador @Auth
    AuthModule,
  ],
})
export class SeedModule {}
