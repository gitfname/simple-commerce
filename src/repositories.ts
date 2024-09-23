import { Repository } from "typeorm"
import { UserEntity } from "./entities/User.entity"
import { AppDataSource } from "./app.datasource"
import { ProductEntity } from "./entities/Product.entity"
import { CategoryEntity } from "./entities/Category.entity"

class Repositories {
    UsersRepository: Repository<UserEntity>
    ProductsRepository: Repository<ProductEntity>
    CategoriesRepository: Repository<CategoryEntity>

    constructor() {
        this.UsersRepository = AppDataSource.getRepository(UserEntity)
        this.ProductsRepository = AppDataSource.getRepository(ProductEntity)
        this.CategoriesRepository = AppDataSource.getRepository(CategoryEntity)
    }
}

export default new Repositories()