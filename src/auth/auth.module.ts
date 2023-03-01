import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  //*Especificamos el JwtStrategy como un provider para que pueda ser usado dentro del modulo
  providers: [AuthService,JwtStrategy],
  imports:[
    ConfigModule,
    //*Importamos el typeOrm como forFeature donde se creara la tabla users en la base de datos
    TypeOrmModule.forFeature(
      [
        //*Importamos la entidad  definida en product.entity.ts
        User
      ]
    ),
    
      //*Defino la estrategia de autenticacion:
      PassportModule.register({defaultStrategy:'jwt'}),
      //*Configuramos el modulo de JWT de manera asincrona
      JwtModule.registerAsync({
        //*Importo el ConfigModule que me permite usar el ConfigService que tiene acceso a las variables de entorno
        imports:[ConfigModule],
        inject:[ConfigService],
        //*Hacemos la inyeccion de dependencia pero en este caso la hacemos en el argumento de la funcion useFactory
        useFactory:(configService:ConfigService)=>{
          //console.log('Variable de entorno',process.env.JWT_SECRET)
          //console.log('Config Service',configService.get('JWT_SECRET'))
          return {
            secret: configService.get('JWT_SECRET'),
            signOptions:{
              expiresIn:'2h'
            }

          }
        }
      })
      // JwtModule.register({
      //   secret: process.env.JWT_SECRET,
      //   signOptions:{
      //     expiresIn:'2h'
      //   }
      // })

  ],
  exports:[
    //*Exporto la configuracion de TypeOrm que ento en este modulo para que sea usado en otros modulos.
    TypeOrmModule,
    //* Tambien lo exportamos para que pueda ser usado en otro modulo
    JwtStrategy,
    PassportModule,
    JwtModule
  ]
})
export class AuthModule {}
