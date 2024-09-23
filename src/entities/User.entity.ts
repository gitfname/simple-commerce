import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { ERoles } from "../guards/role.guard";

@Entity({ name: "users" })
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { length: 255 })
    username: string;

    @Column("varchar", { length: 12 })
    password: string;

    @Column("varchar", { length: 500, nullable: true })
    avatar: string;

    @Column("varchar", { length: 32, nullable: true })
    role: ERoles;

    @CreateDateColumn()
    createdAt: Date;
}