import { PrismaClient } from '@prisma/client'
import { IMajor } from './interfaces/major.interface'
import { majorData } from './datas/major.data'
import { IFieldWork } from './interfaces/field-work.interface'
import { fieldWorkData } from './datas/field-work.data'
import { IProfessionQuestion } from './interfaces/profession-question.interface'
import { professionQuestionData } from './datas/profession-question.data'
import { IPersonalityQuestion } from './interfaces/personality-question.interface'
import { personalityQuestionData } from './datas/personality-question.data'
import { IMbti } from './interfaces/mbti.interface'
import { mbtiData } from './datas/mbti.data'

const prisma = new PrismaClient()

async function seedMajor(data: IMajor[]) {
    if (data.length > 0) {
        const majors = []
        for (const d of data) {
            const { code } = d
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
            const { name } = d
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
            const { id } = d
            const isExist = await prisma.professionQuestion.findUnique({ where: { id } })
            if (isExist) continue
            professionQuestions.push(d)
        }
        await prisma.professionQuestion.createMany({ data: professionQuestions })
        console.log(`successfully seed the ProfessionQuestion ${professionQuestions.length} datas.`)
    }
    return
}

async function seedPersonalityQuestion(data: IPersonalityQuestion[]) {
    if (data.length > 0) {
        const personalityQuestions = []
        for (const d of data) {
            const { id } = d
            const isExist = await prisma.personalityQuestion.findUnique({ where: { id } })
            if (isExist) continue
            personalityQuestions.push(d)
        }
        await prisma.personalityQuestion.createMany({ data: personalityQuestions })
        console.log(`successfully seed the PersonalityQuestion ${personalityQuestions.length} datas.`)
    }
    return
}

async function seedMbti(data: IMbti[]) {
    if (data.length > 0) {
        const mbtis = []
        for (const d of data) {
            const { codeMbti } = d
            const isExist = await prisma.mbti.findUnique({ where: { codeMbti } })
            if (isExist) continue
            mbtis.push(d)
        }
        await prisma.mbti.createMany({ data: mbtis })
        console.log(`successfully seed the MBTI ${mbtis.length} datas.`)
    }
    return
}

async function main() {
    // running seeders
    await seedMajor(majorData)
    await seedFieldWork(fieldWorkData)
    await seedProfessionQuestion(professionQuestionData)
    await seedPersonalityQuestion(personalityQuestionData)
    await seedMbti(mbtiData);
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
