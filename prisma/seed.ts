import { PrismaClient } from '@prisma/client'
import { IMajor } from './interfaces/major.interface'
import { majorData } from './datas/major.data'
import { IFieldWork } from './interfaces/field-work.interface'
import { fieldWorkData } from './datas/field-work.data'
import { IProfessionQuestion } from './interfaces/profession-question.interface'
import { professionQuestionData } from './datas/profession-question.data'

const prisma = new PrismaClient()

async function seedMajor(data: IMajor[]) {
    if (data.length > 0) {
        const majors = []
        for (const d of data) {
            // get data from d variable
            const { code } = d
            // check if data exist
            const isExist = await prisma.major.findUnique({ where: { code } })
            if (isExist) continue
            majors.push(d)
        }
        await prisma.major.createMany({ data: majors })
        console.log(`successfully seed the Major ${majors.length} datas.`)
    }
    return
}

async function seedFieldWork(data: IFieldWork[]) {
    if (data.length > 0) {
        const fieldWorks = []
        for (const d of data) {
            // get data from d variable
            const { name } = d
            // check if data exist
            const isExist = await prisma.fieldWork.findFirst({ where: { name } })
            if (isExist) continue
            fieldWorks.push(d)
        }
        await prisma.fieldWork.createMany({ data: fieldWorks })
        console.log(`successfully seed the Field Works ${fieldWorks.length} datas.`)
    }
    return
}

async function seedProfessionQuestion(data: IProfessionQuestion[]) {
    if (data.length > 0) {
        const professionQuestions = []
        for (const d of data) {
            // get data from d variable
            const { id } = d
            // check if data exist
            const isExist = await prisma.professionQuestion.findUnique({ where: { id } })
            if (isExist) continue
            professionQuestions.push(d)
        }
        await prisma.professionQuestion.createMany({ data: professionQuestions })
        console.log(`successfully seed the ProfessionQuestion ${professionQuestions.length} datas.`)
    }
    return
}

async function main() {
    // running seeders
    seedMajor(majorData)
    seedFieldWork(fieldWorkData)
    seedProfessionQuestion(professionQuestionData)
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