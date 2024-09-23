
import { Expose, Exclude } from "class-transformer";

export class UsersSerializer {
    @Expose()
    id: number;

    @Expose()
    username: string;

    @Exclude()
    password: string;

    @Expose()
    avatar: string;

    @Expose()
    createdAt: Date;
}