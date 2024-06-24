import { Hono } from "hono"
import { Bindings } from "../bindings"
import { PrismaClient } from "@prisma/client"
import { PrismaD1 } from "@prisma/adapter-d1"
import {verifyToken} from "../admin/jwt"

const projects = new Hono<{ Bindings: Bindings }>()

type ProjectType = {
  name: string
  description?: string
}

projects.post("/add", async(c) => {
  const adapter = new PrismaD1(c.env.CHUO_TANZAK)
  const prisma = new PrismaClient({ adapter })

  const userToken = c.req.header("Authorization") || ""
  const ownerId = (await verifyToken(userToken.split(" ")[1], c.env.TOKEN_KEY)).uid

  const data = await c.req.json<ProjectType>()

  const result = await prisma.project.create({
    data: {
      name: data.name,
      description: data.description,
      ownerId,
    }
  })

  return c.json(result)
})

projects.get("/list", async(c) => {
  const adapter = new PrismaD1(c.env.CHUO_TANZAK)
  const prisma = new PrismaClient({ adapter })

  const userToken = c.req.header("Authorization") || ""
  const ownerId = (await verifyToken(userToken.split(" ")[1], c.env.TOKEN_KEY)).uid

  const result = await prisma.project.findMany({
    where: {
      ownerId
    }
  })

  return c.json(result)
})

export default projects
