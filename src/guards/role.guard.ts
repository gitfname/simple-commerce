
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

export enum ERoles {
    user = "user",
    admin = "admin",
    superAdmin = "super-admin"
}

export const RoleGuard = (role: ERoles | ERoles[]) => createMiddleware(async (c, next) => {
    const userRole = c.var?.user?.role

    if (!userRole) throw new HTTPException(500, { message: "use the JwtGuard before the RoleGuard" })

    if (Array.isArray(role)) {
        if (role.findIndex(role => role === userRole) === -1) {
            throw new HTTPException(401, { message: "forbidden" })
        }
    }
    else {
        if (userRole !== role) throw new HTTPException(401, { message: "forbidden" })
    }

    await next()
})