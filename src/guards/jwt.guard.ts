import { createMiddleware } from "hono/factory"
import { HTTPException } from "hono/http-exception"
import { verify } from "hono/jwt"
import ConfigService from "../config-service"
import { ERoles } from "./role.guard"
import { UsersService } from "../services/users.service"

const JwtGuard = createMiddleware<{
    Variables: {
        user: {
            sub: number;
            role: ERoles;
        }
    }
}>(async (c, next) => {
    try {
        const token = c.req.header("authorization")?.split(" ")[1]

        if (!token) throw new HTTPException(401, { message: "token is required" })

        const decodedPayload = await verify(token, ConfigService.getOrThrow("JWT_SECRET")) as any

        if (!decodedPayload) {
            throw new HTTPException(401, { message: "token not valid" })
        }

        const user = await UsersService.findOneById(decodedPayload.sub)

        c.set("user", {
            sub: user.id,
            role: user.role
        })

        await next()
    } catch (error) {
        throw new HTTPException(401, { message: "token not valid" })
    }
})

export default JwtGuard