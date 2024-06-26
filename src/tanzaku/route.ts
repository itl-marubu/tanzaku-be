import { Hono } from "hono"
import { Bindings } from "../bindings"
import { PrismaClient } from "@prisma/client"
import { PrismaD1 } from "@prisma/adapter-d1"
import { sanitizer } from "./sanitizer"

const tanzaku = new Hono<{ Bindings: Bindings }>()

type TanzakuType = {
  textLine1: string
  textLine2?: string
  nameLine: string
}

tanzaku.post("/:id/new", async(c) => {
  const adapter = new PrismaD1(c.env.CHUO_TANZAK)
  const prisma = new PrismaClient({ adapter })
  const id = c.req.param("id")

  const body = await c.req.json<TanzakuType>()
  const [tl1, ng1] = sanitizer(body.textLine1, 8)
  const [tl2, ng2] = body.textLine2 ? sanitizer(body.textLine2, 8) : [undefined, false]
  const [nl, ng3] = sanitizer(body.nameLine, 10)

  if (ng1 || ng2 || ng3) {
    return c.json({ error: "Invalid input" }, 400)
  }

  const tanzakuData = await prisma.tanzakuTxt.create({
    data: {
      textLine1: tl1,
      textLine2: tl2,
      nameLine: nl,
      projectId: id
    }
  })

  return c.json(tanzakuData)
  })

tanzaku.get("/:id/list", async(c) => {
  const adapter = new PrismaD1(c.env.CHUO_TANZAK)
  const prisma = new PrismaClient({ adapter })
  const id = c.req.param("id")

  const tanzakuData = await prisma.tanzakuTxt.findMany({
    where: {
      projectId: id,
      disabled: false,
      locked: false
    }
  })

  return c.json(tanzakuData)
})

tanzaku.delete("/del/:tanzaku", async(c) => {
  const adapter = new PrismaD1(c.env.CHUO_TANZAK)
  const prisma = new PrismaClient({ adapter })
  const tanzaku = c.req.param("tanzaku")

  const tanzakuBaseData = await prisma.tanzakuTxt.findUnique({
    where: {
      id: tanzaku
    }
  }).then((data) => {
    return data?.locked
  })

  if (tanzakuBaseData) {
    return c.json({ error: "Tanzaku not found or locked" }, 400)
  }
  const tanzakuData = await prisma.tanzakuTxt.update({
    where: {
      id: tanzaku
    },
    data: {
      disabled: true,
    }
  })

  return c.json(tanzakuData)
})

export default tanzaku
