import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"

@Entity({ name: "categories" })
export class CategoryEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { length: 255 })
    title: string;

    @Column("varchar", { length: 300, nullable: true })
    icon?: string;

    @ManyToOne(() => CategoryEntity, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn()
    parent?: CategoryEntity;

}