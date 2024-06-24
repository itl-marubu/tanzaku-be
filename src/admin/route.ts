import { Hono } from "hono"
import { sha3_512 } from "js-sha3"
import { createId } from "@paralleldrive/cuid2"
import { PrismaD1 } from "@prisma/adapter-d1"
import { PrismaClient } from "@prisma/client"
import { createToken } from "./jwt"
import type { Bindings } from "../bindings"

const users = new Hono<{ Bindings: Bindings }>()

users.post("/new", async (c) => {
  const adapter = new PrismaD1(c.env.CHUO_TANZAK)
  const prisma = new PrismaClient({ adapter })

  const { email, password } = await c.req.json()
  const user = await prisma.user.create({
    data: {
      email,
      password: sha3_512(password + c.env.SALT),
    },
  })
  if (!user) {
    return new Response("Failed to create user", { status: 500 })
  }
  return c.json({ email: user.email })
})

users.post("/login", async (c) => {
  const adapter = new PrismaD1(c.env.CHUO_TANZAK)
  const prisma = new PrismaClient({ adapter })
  const { email, password } = await c.req.json()
  const user = await prisma.user.findFirst({
    where: {
      email,
      password: sha3_512(password + c.env.SALT),
    },
  })
  if (!user) {
    return new Response("Invalid Login Credentials", { status: 401 })
  }

  const content = {
    token: await createToken(
      {
        email: user.email || "",
        uid: user.id,
        jti: createId(),
      },
      c.env.TOKEN_KEY,
    ),
  }
  return c.json(content)
})

export default users
