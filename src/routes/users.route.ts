
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { CreateUserDto, SignInUserDto } from "../validators";
import { UsersService } from "../services/users.service";
import { plainToInstance } from "class-transformer"
import { UsersSerializer } from "../serializers/users.serializer";
import { z } from "zod"
import JwtGuard from "../guards/jwt.guard";

const app = new Hono()

    .post("/signup", zValidator("json", CreateUserDto), async c => {
        const createdUser = await UsersService.createUser(c.req.valid("json"))
        return c.json(plainToInstance(UsersSerializer, createdUser))
    })

    .post("/login",
        zValidator("json", SignInUserDto),
        async c => {
            return c.json(await UsersService.login(c.req.valid("json").username, c.req.valid("json").password))
        })

    .get("/", async c => {
        return c.json(plainToInstance(
            UsersSerializer,
            await UsersService.findAll()
        ))
    })

    .get("/me", JwtGuard, async c => {
        return c.json(
            plainToInstance(
                UsersSerializer,
                await UsersService.findOneById(c.var.user.sub)
            )
        )
    })

    .get("/:id",
        zValidator("param", z.object({
            id: z.string().max(4)
        })),
        async c => {
            return c.json(
                plainToInstance(
                    UsersSerializer,
                    await UsersService.findOneById(+c.req.valid("param").id)
                )
            )
        })


export default app