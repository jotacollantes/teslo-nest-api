import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {validate as isUUID} from 'uuid'
import { Product,ProductImage } from './entities';
import { handlerErrors } from 'src/helpers';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ProductsService {

//*Creamos una instancia de logger para manejar la visualizacion de los logs. Le especificamos el modulo ProductService
// private readonly logger = new Logger('ProductsService')


  constructor(

    //*Inyectamos el Repositorio con la entity Product
    @InjectRepository(Product)
    private readonly productRepository:Repository<Product>,
    
    //*Inyectamos el Repositorio con la entity ProductImage
    @InjectRepository(ProductImage)
    private readonly productImageRepository:Repository<ProductImage>,
    
    //* Para obtener la cadena de conexion
    private readonly dataSource:DataSource
    )
  {
    
  }
  async create(createProductDto: CreateProductDto,user:User) {
    //return 'This action adds a new product';
    try {
      
      //*Usamos el operador rest ...
      const {images=[],...productDetails}=createProductDto;

      //*Creamos la instancia en ambos repositorios productRepository y productImageRepository
      const product = this.productRepository.create({
        ...productDetails,
        //*Como la propiedad images esta definida como una referencia a la tabla productImage en la entity Product, va a recibir las imagenes que vienen en el dto. al mismo tiempo se van a grabar en entidad ProductImage
        images:images.map((img)=>{
          return this.productImageRepository.create({url:img})
        }),
        //*granamos el id del usuario
        user:user
      });

      //*Luego lo grabamos en la base de datos. Este save graba tanto en productRepository y porductImageRepository

      await this.productRepository.save(product)

      return {...product,images};

    } catch (error) {
      handlerErrors(error,'ProductsService')
    }

  }

  async findAll(paginationDto:PaginationDto) {
    //return `This action returns all products`;
    const {limit=10,offset=0}=paginationDto
    const products =await this.productRepository.find({
      take: limit,
      skip:offset,
      //* Muestro las relaciones es como un pupulate
      relations:{images:true}
    //TODO: relaciones
    })
    return products.map((product)=>{
      return {
        ...product,
        images: product.images.map((img)=>{
          return img.url
        })
      }
    })
  }

  async findOne(term: string) {
    
    let product:Product
    let criterio:string
    if (isUUID(term)){
      //*Con findOneBy se encuentra la primera coincidencia 
      product= await this.productRepository.findOneBy({id: term})
      criterio="uuid"
    }else {
      //product= await this.productRepository.findOneBy({slug: term})
      const queryBuider=this.productRepository.
      //* Hay que especificar el alias
      createQueryBuilder('prod');

      //* :=title or :=slug son argumentos que se van a proporcionar al where
      product=await queryBuider.where('LOWER(title)=:title or slug=:slug',{
        title: term.toLowerCase(),
        slug: term,
      })
      //*Para poder mostrar las imagenes usando el queryBuilder hay que usar un leftJoin. el leftJoin se usa para mostrar los registros de la tabla productos asi no esten presentes los id product en la tabla product_image.

      //* especificamos el nombre de la propiedad y el alias
      .leftJoinAndSelect('prod.images','prodImages')
      .getOne() // como es un or puede que regrese 2 registros, solo recibo un registro

      criterio="slug/title"
    }
    
    //console.log({product})
    if(!product)
    throw new NotFoundException(`Product with criteria ${criterio}: ${term} not found`)
    
    //* pra mostrar las imagenes al momento de hacer una consulta usando el uuid hay que especificar el eager: true en product.entity.
    return product;
  }

  async findOnePlain(term:string){
    const {images=[],...detailsProducts}= await this.findOne(term)
    return {
      ...detailsProducts,
      images: images.map((img=>img.url))
    }
  }

   async update(id: string,
    updateProductDto: UpdateProductDto,
    user:User) {
    
    const {images=[],...detailsToUpdate}=updateProductDto
    //* El preload no carga los datos de las relaciones en este caso de las imagenes.
    const product= await this.productRepository.preload({
      //*Busco el registro
      id : id,
      //*Cargo los datos
      //...updateProductDto,
      ...detailsToUpdate,
      //images:[]
    })
    //console.log(product)
    if(!product) throw new NotFoundException(`Product with id ${id} not found`)

    // Create query runner
    const queryRunner= this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()


    try {
      //* Si vienen las imagenes en el updateProductDto es porque las quiere eliminar (images=[]) o quiere actualizarlas (lo que significa que tiene que eliminarlas e ingresar las nuevas)
      
      if(images.length!==0){
        //* EN los parametros de la funcion .delete() se estan usando las referencias a las entity, ProductImage es la entity y product es la propiedad y el id es el campo id de la entity Product

        //* el arreglo de imagenes tiene esta apariencia: 
        // "images":[
        //     "http://image1.jpg",
        //     "http://image2.jpg"
        // ]
        console.log('vienen imagenes',{images})
        await queryRunner.manager.delete('ProductImage',{product:{id:id}})
        //*Asignamos las nuevas imagenes si es que vienen.
        product.images=images.map((image)=>this.productImageRepository.create({url:image}))

      } else{
        //* SI es que no vienen las imagenes
        console.log('No vienen imagenes',{images})
        //*Se usa findBy porque tiene que devolver una o varias imagenes.
        //* EL criterio de busqueda where tiene el formato {product:{id:id}} porque se hace referencia a un campo que es una relacion
        product.images=await this.productImageRepository.findBy({product:{id:id}})
      }
      //*Incluimos el user que actualizo el producto
      product.user=user
      await queryRunner.manager.save(product)
      await queryRunner.commitTransaction()
      await queryRunner.release()


     //await this.productRepository.save(product)
      //return product
      return this.findOnePlain(id)
    } catch (error) {
      await queryRunner.rollbackTransaction()
      await queryRunner.release()
      handlerErrors(error,'ProductsService')
    }
  }

  async remove(id: string) {
    
    // const product =await this.productRepository.findOneBy({id})
    // if(!product) {
    //   throw new BadRequestException(`Product with id ${id} not found`)
    // }
   const product=await this.findOne(id)
   try {
      //* Se puede usar this.productRepository.delete
      await this.productRepository.remove(product)
      return `Product with id ${id} was deleted`
    } catch (error) {
      handlerErrors(error,'ProductsService')
    }

    
  }

  //*Para usarlo en la carga inicial de datos Seed
  async deleteAllProducts(){
    const query= this.productRepository.createQueryBuilder('product')

    try {
      return await query.delete().where({}).execute()
    } catch (error) {
      handlerErrors(error,'AuthService')
    }

  }

  
}
