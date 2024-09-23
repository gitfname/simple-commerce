
import { DataSource } from "typeorm"
import { UserEntity } from "./entities/User.entity"
import { join } from "path"
import { ProductEntity } from "./entities/Product.entity"
import { CategoryEntity } from "./entities/Category.entity"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: join(__dirname, "db/db.sqlite"),
    synchronize: true,
    entities: [UserEntity, ProductEntity, CategoryEntity],
})
