import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { CategoryEntity } from "./Category.entity";

export interface IProductProperty {
    name: string;
    value: string;
}

@Entity({ name: "products" })
export class ProductEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { length: 255 })
    title: string;

    @Column("varchar", { length: 3000 })
    description: string;

    @Column("int")
    price: number;

    @Column("int2", { nullable: true, default: 0 })
    discount?: number;

    @Column("json", { nullable: true })
    properties?: IProductProperty[];

    @Column("varchar", { length: 350 })
    thumbnail: string;

    @Column("json")
    images: string[];

    @Column("boolean", { default: true })
    isPublic: boolean;

    @ManyToOne(() => CategoryEntity, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn()
    category?: CategoryEntity;

}