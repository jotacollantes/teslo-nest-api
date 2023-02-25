import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';



@Injectable()
export class SeedService {

  constructor(
    //*Inyectamos la dependencia class ProductsService para poder usar todos sus metodos publicos
    
    private readonly productsService:ProductsService,
    ){}
  

  async runSeed() {
    //return `Seed execute`;
    return this.insertNewProducts()
  }


  private async insertNewProducts(){
    //Delete Product
   await this.productsService.deleteAllProducts()
   const products=initialData.products
    
    const insertPromises=[]
    for (const product of products) {
      //*puedo usar product porque luce igual a CreateProductDto
      insertPromises.push(this.productsService.create(product))
    }
    await Promise.all(insertPromises)
    return true
  }
 
}
