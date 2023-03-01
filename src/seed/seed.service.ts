import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    //*Inyectamos la dependencia class ProductsService para poder usar todos sus metodos publicos
    //*Aqui no se necesita Inject porque ya incluimos en el import el ProductsModule
    private readonly productsService: ProductsService,
    //*Aqui usamos el Inject porque necesitamos importar el repositorio conla entidad User
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    //return `Seed execute`;

    await this.deleteTables();
    const firstUser = await this.insertUsers();
    await this.insertNewProducts(firstUser);
    return 'Seed Execute';
  }

  //*Borrar tablas de forma individual

  private async deleteTables() {
    //*COmo tenemos definido cascade tambien se borran las imagenes
    await this.productsService.deleteAllProducts();

    //*Borramos los usuarios
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({}) //todos los usuarios
      .execute();
  }

  private async insertUsers() {
    const seeduser = initialData.users;

    const users: User[] = [];
    for (const user of seeduser) {
      //*Mapeamos cada usuario

      user.password = bcrypt.hashSync(user.password, 10);

      users.push(this.userRepository.create(user));
    }

    //*es necesario crear la variable dbUsers de lo constrario la variable user[] no incluye el id y el seed dara error al ejecutarse.

    const dbUsers = await this.userRepository.save(users);
    //*Devuelvo el primer usuario definido en el seed que tiene el rol de admin
    return dbUsers[0];
  }

  private async insertNewProducts(user: User) {
    //Delete Product
    //await this.productsService.deleteAllProducts()
    const products = initialData.products;

    const insertPromises = [];
    for (const product of products) {
      //*puedo usar product porque luce igual a CreateProductDto
      insertPromises.push(this.productsService.create(product, user));
    }
    await Promise.all(insertPromises);
    return true;
  }
}
