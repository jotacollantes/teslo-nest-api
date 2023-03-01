import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';

export const GetUser=createParamDecorator(
    
    (data:string,ctx:ExecutionContext)=>{
        //console.log({ctx})
        const req=ctx.switchToHttp().getRequest()
        const user=req.user

        if(!user) throw new InternalServerErrorException('User not found (request)')
         
        switch (data) {
            case 'email':
                const {email} = user
                return email
        
            default:
                return user
        }

        

    }
)