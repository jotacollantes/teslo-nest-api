//* hay que instalar los paquetes:
//* yarn add class-validator class-transformer

import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";


export class CreateProductDto {
    //*Como se va a recibir en la base de datos:

    //* Usamos los decoradores

    @IsString()
    @MinLength(1)
    title: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @IsString()
    @IsOptional()
    description?:string;

    @IsString()
    @IsOptional()
    slug?:string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?:number;

    @IsString({
        //*Cada elemento del array tiene que ser string
        each:true
    })

    @IsArray()
    sizes: string[];

    
    @IsIn(['men','women','kid','unisex'])
    gender: string;

    @IsString({
        //*Cada elemento del array tiene que ser string
        each:true
    })
    @IsArray()
    //* SI no lo manda se graba como un array vacio [] porque tiene un valor por defecto definido en el entity
    @IsOptional()
    tags: string[];



    @IsString({
        //*Cada elemento del array tiene que ser string
        each:true
    })
    @IsArray()
    //* SI no lo manda se graba como un array vacio [] porque tiene un valor por defecto definido en el entity
    @IsOptional()
    images?:string[];


}
