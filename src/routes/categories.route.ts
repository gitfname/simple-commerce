import { CategoriesService } from "../services/categories.service";
import { plainToInstance } from "class-transformer";
import { CategoriesSerializer, TreeCategoriesSerializer } from "../serializers/categories.serializer";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import JwtGuard from "../guards/jwt.guard";
import { CreateCategoryDto, UpdateCategoryDto } from "../validators";
import ParseIntMiddleware from "../common/middlewares/ParseInt.middleware";
import { ERoles, RoleGuard } from "../guards";

const app = new Hono()

    .post("/",
        JwtGuard,
        RoleGuard(ERoles.superAdmin),
        zValidator("json", CreateCategoryDto),
        async c => {
            return c.json(
                plainToInstance(
                    CategoriesSerializer,
                    await CategoriesService.create(c.req.valid("json"))
                )
            )
        })

    .get("/",
        async c => {
            return c.json(
                plainToInstance(
                    CategoriesSerializer,
                    await CategoriesService.findAll()
                )
            )
        })

    .get("/tree", async c => {
        return c.json(
            plainToInstance(
                TreeCategoriesSerializer,
                await CategoriesService.tree()
            )
        )
    })

    .get("/:id",
        ParseIntMiddleware<"id">("id", "param"),
        async c => {
            return c.json(
                plainToInstance(
                    CategoriesSerializer,
                    await CategoriesService.findOneById(c.var.numbers.id)
                )
            )
        })

    .put("/:id",
        ParseIntMiddleware<"id">("id", "param"),
        JwtGuard,
        RoleGuard(ERoles.superAdmin),
        zValidator("json", UpdateCategoryDto),
        async c => {
            await CategoriesService.updateOneById(c.var.numbers.id, c.req.valid("json"))
            return c.text("")
        }
    )

    .delete("/:id",
        JwtGuard,
        RoleGuard(ERoles.superAdmin),
        ParseIntMiddleware<"id">("id", "param"),
        async c => {
            await CategoriesService.deleteOneById(c.var.numbers.id)
            return c.text("")
        })

export default app