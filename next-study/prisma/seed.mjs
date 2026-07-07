import { fakerJA } from '@faker-js/faker'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../app/generated/prisma/index.js'

const targetCount = 1500
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error('DATABASE_URL is required')
  process.exit(1)
}

const adapter = new PrismaPg({ connectionString })

async function main() {
  const prisma = new PrismaClient({ adapter })

  try {
    const existingCount = await prisma.task.count()
    const tasksToCreate = Math.max(0, targetCount - existingCount)

    if (tasksToCreate === 0) {
      console.log(`Task count already reaches ${existingCount}. No new seed data inserted.`)
      return
    }

    const titlePrefixes = [
      '営業資料の整理',
      '顧客への返信',
      '会議の議事録作成',
      'レビューコメント対応',
      'デザイン案の確認',
      'サーバー監視の確認',
      '在庫確認の連絡',
      '月次レポート更新',
      '新規機能のテスト',
      '障害対応のまとめ',
      '申請書の承認依頼',
      '問い合わせ内容の追跡',
      '社内向け共有資料作成',
      '定例会の進行管理',
      '外部ツールの設定確認',
    ]

    const titleSuffixes = [
      'を進める',
      'を完了する',
      'を確認する',
      'を再確認する',
      'の準備をする',
      'の内容を整理する',
      'の件を追跡する',
      'をレビューする',
      'の対応をまとめる',
      'を共有する',
    ]

    const bodyTemplates = [
      '期限に間に合うように、関連資料を確認しながら着手する。',
      '関係者に共有する前に、内容を整理しておく。',
      '必要な情報が足りない場合は、追加で確認を行う。',
      '実施手順をまとめて、次回の作業に活かせる形にしておく。',
      '進捗を把握しながら、優先度の高い項目から順に対応する。',
      '完了後はメモを残し、今後の参考資料として扱う。',
      '担当者間で認識を揃えるために、要点を整理しておく。',
      '作業の範囲を明確にして、余分な手戻りを減らす。',
      '必要に応じて関係部署へ依頼し、スムーズに進める。',
    ]

    const detailTemplates = [
      '必要に応じて担当者へ依頼する。',
      '完了後は記録を残して次回に備える。',
      '進捗状況を確認しながら進める。',
      '内容に不明点があれば、早めに確認する。',
      '関係資料を参照して、漏れなく対応する。',
      '期限を意識して、着手順序を整理する。',
    ]

    const buildTaskData = () => {
      const createdAt = fakerJA.date.recent({ days: 180 })
      const updatedAt = fakerJA.date.between({ from: createdAt, to: new Date() })
      const title = `${fakerJA.helpers.arrayElement(titlePrefixes)}${fakerJA.helpers.arrayElement(titleSuffixes)}`
      const body = `${fakerJA.helpers.arrayElement(bodyTemplates)} ${fakerJA.helpers.arrayElement(detailTemplates)}`

      return {
        title,
        body,
        completed: fakerJA.datatype.boolean(),
        createdAt,
        updatedAt,
      }
    }

    const data = Array.from({ length: tasksToCreate }, buildTaskData)

    for (let index = 0; index < data.length; index += 200) {
      const batch = data.slice(index, index + 200)
      await prisma.task.createMany({ data: batch })
    }

    console.log(`Inserted ${tasksToCreate} tasks into the Task table.`)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
