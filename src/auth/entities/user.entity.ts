import { Product } from "../../products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

//*Nombre de la tabla
@Entity({name:'users'})
export class User {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text',{
        unique:true
    })
    email:string;

    @Column('text',{
        //* Le digo a next que la contraseña nunca aparecera en los resultados de los find()
        select:false
    })
    password:string;

    @Column('text')
    fullName: string;

    @Column('boolean',{default:true})
    isActive: boolean;

    @Column('text',{
        array:true,
        default:['user']
    })
    roles: string[];


@OneToMany(
    //*especificamos a que Entity debe de apuntar
    ()=>Product,
     //*Especificamos el campo en la entidad Product que hara el vinculo entre ambas entidades
     (product)=>product.user,
)
 //*Se define la referencia product como un Product
product:Product

@BeforeInsert()
    checkEmailBeforeInsert(){
        this.email=this.email.toLowerCase().trim()
    }

    @BeforeUpdate()
    checkEmailBeforeUpdate(){
        this.checkEmailBeforeInsert()
    }


}
