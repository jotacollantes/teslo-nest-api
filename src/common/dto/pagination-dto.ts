import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto{
    @IsOptional()
    @IsPositive()
    //* Hay que hacer una transformacion porque los datos en los query paramams se reciben como Strings. El lugar de especificar las trasnformacion en /src/main.ts:
    
    // new ValidationPipe({ 
    //     whitelist: true, 
    //     forbidNonWhitelisted: true,
    //      transform:true,
    //      transformOptions:{enableImplicitConversion:true}
    //   }) 
         //*Usamos el @Type(()=>Number)

    @Type( ()=> Number )
    limit?:number;

    @IsOptional()
    //@IsPositive()
    @Min(0)
    @Type( ()=> Number )
    offset?:number;

}