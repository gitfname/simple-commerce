
import { Hono, } from "hono"
import { ProductsService } from "../services/products.service"
import { plainToInstance } from "class-transformer"
import { ProductsSerializer } from "../serializers/products.serializer"
import { zValidator } from "@hono/zod-validator"
import { CreateProductDto, UpdateProductDto } from "../validators"
import ParseIntMiddleware from "../common/middlewares/ParseInt.middleware"
import JwtGuard from "../guards/jwt.guard"
import { ERoles, RoleGuard } from "../guards"

const app = new Hono()

    .post("/",
        JwtGuard,
        RoleGuard(ERoles.superAdmin),
        zValidator("json", CreateProductDto),
        async c => {
            return c.json(plainToInstance(
                ProductsSerializer,
                await ProductsService.create(c.req.valid("json"))
            ))
        })

    .get("/", async c => {
        return c.json(plainToInstance(
            ProductsSerializer,
            await ProductsService.findAll()
        ))
    })

    .get("/:id",
        ParseIntMiddleware<"id">("id", "param"),
        async c => {
            return c.json(
                plainToInstance(
                    ProductsSerializer,
                    await ProductsService.findOneById(c.var.numbers.id)
                )
            )
        })

    .put("/:id",
        JwtGuard,
        RoleGuard(ERoles.superAdmin),
        ParseIntMiddleware<"id">("id", "param"),
        zValidator("json", UpdateProductDto),
        async c => {
            await ProductsService.updateOneById(
                c.var.numbers.id,
                c.req.valid("json")
            )

            return c.text("")
        })

    .delete("/:id",
        JwtGuard,
        RoleGuard(ERoles.superAdmin),
        ParseIntMiddleware<"id">("id", "param"),
        async c => {
            await ProductsService.deleteOneById(c.var.numbers.id)
            return c.text("")
        })

export default app