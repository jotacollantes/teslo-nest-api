import { Injectable, BadRequestException } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';


@Injectable()
export class FilesService {
 getStaticProducImage(imageName:string){

    //*COncatenamos el path y el nombre del archivo
    const path=join(__dirname,'../../static/products',imageName)
    //console.log(path)
    if (!existsSync(path)) throw new BadRequestException(`No product found with the image ${imageName}`)
    //* en este punto retorno el path
    return path
 }
}
