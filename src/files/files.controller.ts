import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter,fileNamer } from './helpers';



@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    //*Inyectamos ConfigService para poder leer las variables de entorno
    private readonly configService: ConfigService
    ) {}



  @Get('product/:imageName')
  findProductImage(
    @Res() res:Response,
    @Param('imageName') imageName:string
    ){

      //* Con Res manualmente emitimos la respuesta

    const fileName=this.filesService.getStaticProducImage(imageName)

    //return fileName
    // res.status(200).json({
    //   ok: true,
    //   fileName})
    res.sendFile(fileName)

  }
  @Post('product')
  //*Usamos interceptor @UseInterceptor que interceptara la solicitud (request)
  //* Especificamos el nombre de la propiedad del body que se esta esperando
  @UseInterceptors(FileInterceptor('file',{
    //*La propiedad fileFilter es una propiedad propia de File interceptor y le asignamos la referencia al helper fileFilter. se ejecuta siempre y cuando el archivo sea recibido o exista
    fileFilter: fileFilter,
    //limits:{fileSize:1000},
    storage:diskStorage({
      destination: './static/products',
      filename: fileNamer,
    }),
    
  }))
  //*Usamos el decorador @UploadedFile
  uploadFile(@UploadedFile() file:Express.Multer.File){
    
    
     if(!file){
      throw new BadRequestException('Make sure that the file is an image')
     }
     console.log('File in Controller',{file})
     const secureUrl= `${this.configService.get('HOST_API')}/files/product/${file.filename}`
      return {
        secureUrl
      }
  }
}