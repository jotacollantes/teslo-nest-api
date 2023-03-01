import { BadRequestException, Injectable, InternalServerErrorException, Logger, Delete, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { handlerErrors } from 'src/helpers';
import { Repository } from 'typeorm';
import { CreateUserDto,LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt'
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class AuthService {
  // private readonly logger = new Logger('AuthService')
  constructor(
    //*Inyectamos el repositorio y especificamos la Identidad
    @InjectRepository(User)
    private readonly userRepository:Repository<User>,
    //*JwtService ya tiene la configuracion especificada en el AuthModule en el modulo JwtModule
    private readonly jwtService:JwtService
  ){}
  async create(createUserDto: CreateUserDto) {
    //return 'This action adds a new auth';
    try {
      const user = this.userRepository.create(createUserDto)
      user.password=bcrypt.hashSync(createUserDto.password,10)
      await this.userRepository.save(user)
      //*Borramos el passwor para que no aparezca en la respuesta.
      delete user.password
      //Todo retornar JWT
      return {
        ...user,
        //*tengo que enviar el argumento {email:user.email} como un objeto porque asi esta especificado en la interface JwtInterface
        //token: this.getJwt({email:user.email})
        //*Genero el JWT
        token: this.getJwt({id:user.id}) 
      };
      
    } catch (error) {
      handlerErrors(error,'AuthService')
      
    }
  }

   async login(loginUserDto:LoginUserDto){
    
    const {email,password}  =loginUserDto

  
        //* Las opciones en el find son ingresadas como un objetos {} con propiedades {where:{},select:{}}, Solo especifico que el query me devuelva el email, el password y el id
        const user=await this.userRepository.findOne({where:{email:email},select:{email:true,password:true,id:true}})

        
        if(!user) throw new UnauthorizedException('Credentials are not valid')
         
        //* EN este punto el usario existe
        if(!bcrypt.compareSync(password,user.password))  throw new UnauthorizedException('Credentials are not valid')
        //Todo retornar JWT
        
        return {
          ...user,
          //*tengo que enviar el argumento {id:user.id} como un objeto porque asi esta especificado en la interface JwtInterface
          //token: this.getJwt({email:user.email})
          //*Genero el JWT
          token: this.getJwt({id:user.id}) 
        };
        
   
   }
   
   private getJwt(payload:JwtPayload){

    const token=this.jwtService.sign(payload)
    return token;
   }


   checkAuthStatus(user:User){

    return {
      // email: user.email,
      // fullName: user.fullName,
      // roles:user.roles,
      ...user,
      token: this.getJwt({id:user.id})
    }
   }
   

}
