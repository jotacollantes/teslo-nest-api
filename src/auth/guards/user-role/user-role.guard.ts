import { CanActivate, ExecutionContext, Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(

    //*Para poder obtener la metadata definida en @SetMetadata('roles',['admin','super-user']) del controlador
    private readonly reflector:Reflector
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    //* Leo los roles usando el reflector  
    const validRoles=this.reflector.get(META_ROLES,context.getHandler())

    //*En caso de que no envie rol, se lo deja pasar
    if(!validRoles) return true;
    if (validRoles.length===0) return true;

    const req=context.switchToHttp().getRequest();
    const user=req.user as User;

    if(!user) throw new BadRequestException('User not found')

    for (const rol of user.roles) {
      //* validRoles Contiene: ['admin','super-user']
      if(validRoles.includes(rol))
      return true
    }

    //* En este punto el usuario no tiene el rol necesario
    throw new ForbiddenException(`User ${user.email} need the role [${validRoles}]`)
    //return true;
  }
}
