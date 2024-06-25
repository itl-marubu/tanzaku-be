import { Hono } from "hono"
import { Bindings } from "./bindings"
import projects from "./projects/route"
import users from "./admin/route"
import { cors } from "hono/cors"

import type { Context, Next } from "hono"
import { jwt } from "hono/jwt"
import tanzaku from "./tanzaku/route"

const app = new Hono<{ Bindings: Bindings }>()

app.use(
  "/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
)

app.use(
  "/projects/*",
  async (
    c: Context<{
      Bindings: Bindings
    }>,
    next: Next,
  ) => jwt({ secret: c.env.TOKEN_KEY })(c, next),
)

app.use(
  "/tanzakus/del/*",
  async (
    c: Context<{
      Bindings: Bindings
    }>,
    next: Next,
  ) => jwt({ secret: c.env.TOKEN_KEY })(c, next),
)

app.route("/projects", projects)
app.route("/admin", users)
app.route("/tanzaku", tanzaku)

export default app
