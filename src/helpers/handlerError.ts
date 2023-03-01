import { BadRequestException, InternalServerErrorException, Logger } from "@nestjs/common"

export const  handlerErrors=(error:any,service:string)=>{
    const logger = new Logger(service)
    //console.log(error)
      //* El codigo 23505 es el codigo de validaciones de constraints
      if(error.code==='23505') throw new BadRequestException(error.detail)

      logger.error(error)
      throw new InternalServerErrorException('Unespected Error, check server logs')
  }