import { User } from '../../auth/entities/user.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductImage } from './';

//* Decaranos la clase como un tipo @Entity
//*Nombre de la tabla
@Entity({name:'products'})
export class Product {
  //*Decoramos la columna con @PrimaryGeneratedColumn
  @PrimaryGeneratedColumn('uuid')
  id: string;

  //*Usamos el decorador @Column con el constrain unique
  @Column('text', { unique: true })
  title: string;

  @Column('float', { default: 0 })
  price: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  descripcion: string;

  @Column({
    type: 'text',
    unique: true,
  })
  slug: string;

  @Column('int', { default: 0 })
  stock: number;
  @Column('text', {
    array: true,
  })
  sizes: string[];

  @Column('text')
  gender: string;


  @Column('text',{
    array:true,
    default:[]
  })
  tags:string[];

  //*Creamos la relacion uno a muchos (NO ES UNA COLUMNA)
  @OneToMany(
    //*especificamos a que Entity debe de apuntar
    ()=>ProductImage,
    //*Especificamos el campo en la entidad ProductImage que hara el vinculo entre ambas entidades
    (productImage)=>productImage.product,
      //*SI hay una afectacion a la entodad producto como por ejemplo un delete, automaticamente se borran los registros vinculados en la entidad imagen
      {cascade: true,
        //*Para que cargue los datos de las imagenes cuando se ejecute una consulta con cualquier tipo de find
        eager:true
      }
    )

    //*Se define la referencia images como un ProductImage[]
  images?:ProductImage[]


  @ManyToOne(
    //*especificamos a que Entity debe de apuntar
    ()=>User,
    //*Especificamos el campo en la entidad User que hara el vinculo entre ambas entidades
    (user)=>user.product,

     //*Para que cargue los datos dek usario cuando se ejecute una consulta con cualquier tipo de find
     {eager:true}


  )
  //*Se define la referencia user como un User
    user:User




  //*Evualuamos el slug antes de hacer el insert
  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }



  //*Evualuamos el slug antes de hacer el update
  @BeforeUpdate()
  checkSlugUpdate() {
    //* Esta validacion no es necesaria porque este objeto Producto ya viene con los datos cargados desde el metodo update del servicio: this.productRepository.preload()
  //   if (!this.slug) {
  //     this.slug = this.title;
  //   }
  
    //console.log(this.slug)
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
      
  }
  
}
