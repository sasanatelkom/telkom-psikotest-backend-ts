import { Prisma, PrismaClient } from '@prisma/client'
import { IMajor } from './interfaces/major.interface'
import { majorData } from './datas/major.data'

const prisma = new PrismaClient()

async function seedMajor(data: IMajor[]) {
    if (data.length > 0) {
        const majors = []
        for (const d of data) {
            // get data from d variable
            const { name } = d
            // check if data exist
            const isExist = await prisma.major.findFirst({ where: { name } })
            if (isExist) continue
            majors.push(d)
        }
        await prisma.major.createMany({ data: majors })
        console.log(`successfully seed the Major ${majors.length} datas.`)
    }
    return
}



async function main() {
    // running seeders
    seedMajor(majorData)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })