import { Hono } from "hono"
import { Bindings } from "../bindings"
import { PrismaClient } from "@prisma/client"
import { PrismaD1 } from "@prisma/adapter-d1"
import {verifyToken} from "../admin/jwt"

const projects = new Hono<{ Bindings: Bindings }>()

type ProjectType = {
  name: string
  description?: string
  noticeLarge?: string
  noticeQR?: string
}

projects.post("/", async(c) => {
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

projects.get("/", async(c) => {
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

projects.get("/:id", async(c) => {
  const adapter = new PrismaD1(c.env.CHUO_TANZAK)
  const prisma = new PrismaClient({ adapter })

  const id = c.req.param("id") || ""

  const result = await prisma.tanzakuTxt.findMany({
    where: {
      projectId: id
    }
  })

  return c.json(result)
})

projects.patch("/:id", async(c) => {
  const adapter = new PrismaD1(c.env.CHUO_TANZAK)
  const prisma = new PrismaClient({ adapter })

  const id = c.req.param("id") || ""

  const data = await c.req.json<ProjectType>()

  const result = await prisma.project.update({
    where: {
      id
    },
    data: {
      name: data.name,
      description: data.description,
      noticeLarge: data.noticeLarge,
      noticeQR: data.noticeQR
    }
  })

  return c.json(result)
})

projects.delete("/:id", async(c) => {
  const adapter = new PrismaD1(c.env.CHUO_TANZAK)
  const prisma = new PrismaClient({ adapter })

  const id = c.req.param("id") || ""

  // fkで紐づいているtanzakuTxtも削除される

  await prisma.tanzakuTxt.deleteMany({
    where: {
      projectId: id
    }
  })


  const result = await prisma.project.delete({
    where: {
      id
    }
  })

  return c.json(result)
})

export default projects
