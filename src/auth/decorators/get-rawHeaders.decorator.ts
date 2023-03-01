import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';

export const GetRawHeaders=createParamDecorator(
    
    (data,ctx:ExecutionContext)=>{
        //console.log({ctx})
        const req=ctx.switchToHttp().getRequest()
     return req.rawHeaders
         

        

    }
)