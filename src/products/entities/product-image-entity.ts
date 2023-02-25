import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./";

@Entity({name:'product_images'})
export class ProductImage{
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    url:string;


     //*Se define la referencia product del tipo de Objeto Product (NO ES UNA COLUMNA)
    @ManyToOne(
        ()=>Product,
        (product)=>product.images,
        {
            //*En caso de que se elimine un producto tambien se eliminen las imagenes
            onDelete:"CASCADE"
        }
        
        
    )
   
    product:Product
}