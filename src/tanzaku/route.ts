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
  const tl1 = sanitizer(body.textLine1, 8)
  const tl2 = body.textLine2 ? sanitizer(body.textLine2, 8) : undefined
  const nl = sanitizer(body.nameLine, 10)

  const tanzakuData = prisma.tanzakuTxt.create({
    data: {
      textLine1: tl1,
      textLine2: tl2,
      nameLine: nl,
      projectId: id
    }
  })

  return c.json(tanzakuData)
  })

tanzaku.delete("/:tanzaku/del", async(c) => {
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
  const tanzakuData = prisma.tanzakuTxt.update({
    where: {
      id: tanzaku
    },
    data: {
      disabled: false,
    }
  })

  return c.json(tanzakuData)
})

export default tanzaku
