import { Hono } from 'hono'
import { cors } from "hono/cors"
import { AppDataSource } from './app.datasource'

// initialize application data-source
AppDataSource.initialize()
  .then(() => console.log("Database connection established"))
  .catch(err => {
    console.log("Something went wrong while trying to connect to Database")
    console.error(err)
  })

// routes
import UsersRoutes from "./routes/users.route"
import ProductsRoutes from "./routes/products.route"
import CategoriesRoutes from "./routes/categories.route"

const app = new Hono()

// export const main = () => {

app.use("*", cors({
  origin: "*"
}))

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

const routes = app
  .route("/users", UsersRoutes)
  .route("/products", ProductsRoutes)
  .route("/categories", CategoriesRoutes)

// console.log("Application is running")

// return routes
// }

export default app

export type AppType = typeof routes
