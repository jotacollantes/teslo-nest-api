

import {v4 as uuid} from 'uuid'
export const fileNamer=(req: Express.Request,file:Express.Multer.File,callback:Function)=>{
   
    console.log("Desde el helper fileFilter",{file})
    //console.log(file)
    
    //const fileName=file.originalname
    const fileExtension=file.mimetype.split('/')[1]
    callback(null,`${uuid()}.${fileExtension}`)
}