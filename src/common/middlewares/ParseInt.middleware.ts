import { MiddlewareHandler } from "hono"
import { createMiddleware } from "hono/factory"
import { HTTPException } from "hono/http-exception"

type Positions = "param" | "query"

interface IType<T extends string> {
    Variables: {
        numbers: {
            [key in T]: number
        }
    }
}

const ParseIntMiddleware = <T extends string>(paramName: T, pos: Positions): MiddlewareHandler<IType<T>, string, {}> => {
    const middleware = createMiddleware<IType<T>>(async (c, next) => {

        if (Number.isNaN(Number(c.req[pos](paramName)))) {
            throw new HTTPException(400, { message: paramName + " must be a valid number" })
        }

        (c as any).set("numbers", {
            ...c.var.numbers,
            [paramName]: Number(c.req[pos](paramName))
        })

        await next()
    })

    return middleware
}

export default ParseIntMiddleware