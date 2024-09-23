import { Exclude, Expose, Type } from "class-transformer"

export class CategoriesSerializer {
    @Expose()
    id: number;

    @Expose()
    title: string;

    @Expose()
    icon?: string | undefined;

    @Expose()
    @Type(() => CategoriesSerializer)
    parent?: CategoriesSerializer | undefined;
}

export class TreeCategoriesSerializer {
    @Expose()
    id: number;

    @Expose()
    title: string;

    @Expose()
    icon?: string | undefined;

    @Exclude()
    parent?: CategoriesSerializer | undefined;

    @Expose()
    @Type(() => TreeCategoriesSerializer)
    children: CategoriesSerializer[] | null
}