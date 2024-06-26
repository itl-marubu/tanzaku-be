import { Hono } from "hono"
import { Bindings } from "../bindings"
import { PrismaClient } from "@prisma/client"
import { PrismaD1 } from "@prisma/adapter-d1"
import {verifyToken} from "../admin/jwt"

const pubProjects = new Hono<{ Bindings: Bindings }>()


pubProjects.get("/:id", async(c) => {
  const adapter = new PrismaD1(c.env.CHUO_TANZAK)
  const prisma = new PrismaClient({ adapter })

  const id = c.req.param("id") || ""

  const result = await prisma.project.findFirst({
    where: {
      id: id
    }
  })

  return c.json(result)
})


export default pubProjects
