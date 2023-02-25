

export const fileFilter=(req: Express.Request,file:Express.Multer.File,callback:Function)=>{
   
    console.log("Desde el helper fileFilter",{file})
    //console.log(file)
    if(!file) 
    {
        return callback(new Error('File is empty'),false)
    }
    
    const fileExtension= file.mimetype.split('/')
    const validExtension=['jpg','jpeg','png','gif']
    if (!validExtension.includes(fileExtension[1])){
        return callback(null,false)
    }
    callback(null,true)
}