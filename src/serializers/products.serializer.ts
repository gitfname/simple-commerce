import { Expose, Type } from "class-transformer";
import { type IProductProperty } from "../entities/Product.entity";
import { CategoriesSerializer } from "./categories.serializer";

export class ProductsSerializer {
    @Expose()
    id: number;

    @Expose()
    title: string;

    @Expose()
    description: string;

    @Expose()
    price: number;

    @Expose()
    discount?: number | undefined;

    @Expose()
    isPublic: boolean;

    @Expose()
    properties?: IProductProperty[] | undefined;

    @Expose()
    images: string[];

    @Expose()
    thumbnail: string;

    @Expose()
    @Type(() => CategoriesSerializer)
    category: CategoriesSerializer | undefined;
}