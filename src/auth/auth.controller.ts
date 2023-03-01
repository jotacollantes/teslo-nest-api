import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IncomingHttpHeaders } from 'http';
import { AuthService } from './auth.service';
import { Auth, GetRawHeaders, GetUser, RoleProtected } from './decorators';
import { CreateUserDto,LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-auth-validate')
  @Auth()
  checkAuthSatus(
    //*Custom Argument Decorator
    @GetUser() user:User
  ){
      
    //console.log(user.id)
    return this.authService.checkAuthStatus(user)
  }




  @Get('testprivate')

  //* El AuthGuard usa la estrategia Jwt definida en el PassportModule.register({defaultStrategy:'jwt'}) que a su vez usa la clase JwtStrategy

  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() request: Express.Request,
    //*Custom Argument Decorator
    @GetUser() user:User,
    @GetUser('email') email:string,
    @GetRawHeaders() rawHeaders: string[],
 @Headers() headers: IncomingHttpHeaders

  )
  {
    //console.log(request)
    return {
      ok:"true",
      message:'Hola Mundo privado',
      user:user,
      userEmail: email,
      rawHeaders: rawHeaders,
      headers 
    }
  }


  //*NO se recomienda usar @SetMetadata
  //@SetMetadata('roles',['admin','super-user'])
  
  @Get('testprivate2')
  @RoleProtected(ValidRoles.superUser,ValidRoles.admin)
   //* El AuthGuard usa la estrategia Jwt definida en el PassportModule.register({defaultStrategy:'jwt'})
   //*Inyectamos el Guard personalizado UserRoleGuard sin () o sea sin crear la instancia
  @UseGuards(AuthGuard(),UserRoleGuard)
  privateRoute2(
    //*Custom Argument Decorator
    @GetUser() user:User
  ){
    return {
      ok:true,
      user:user
    }
  }

  @Get('testprivate3')
  //*Validamos que sea un usuario con el role 'admin'
  @Auth(ValidRoles.admin)
  privateRoute3(
    //*Custom Argument Decorator
    @GetUser() user:User
  ){
    return {
      ok:true,
      user:user
    }
  }
}
