import { Hono } from "hono"
import { Bindings } from "./bindings"
import projects from "./projects/route"
import users from "./admin/route"
import { cors } from "hono/cors"

import type { Context, Next } from "hono"
import { jwt } from "hono/jwt"
import tanzaku from "./tanzaku/route"
import pubProjects from "./pubProject/route"

const app = new Hono<{ Bindings: Bindings }>()

app.use(
  "/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
)

app.route("/projects", projects)
app.route("/pub", pubProjects)
app.route("/admin", users)
app.route("/tanzaku", tanzaku)

export default app
