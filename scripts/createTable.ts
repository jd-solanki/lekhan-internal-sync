import fs from 'node:fs'
import path from 'node:path'

const tableName = process.argv[2]

if (!tableName) {
  console.error('❌ Please provide a resource name. Example: pnpm tsx createTable.ts user')
  process.exit(1)
}

// Utility to capitalize first letter
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function to_pascalCase(str: string) {
  return str
    .split(/_|-|\s+/)
    .map(word => capitalize(word))
    .join('')
}

function getTableTemplate(tableName: string) {
  return `
import { relations } from 'drizzle-orm'
import { boolean, integer, pgEnum, pgTable, primaryKey, text, varchar } from 'drizzle-orm/pg-core'
import { mixinCreatedAt, mixinDeletedAt, mixinId, mixinUpdatedAt } from '../mixins'

export const dbTable${to_pascalCase(tableName)} = pgTable('${tableName}', {
  ...mixinId(),
}
`.trim()
}

function getSchemaTemplate(tableName: string) {
  const formattedTableName = to_pascalCase(tableName)

  return `
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'  
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { dbTable${formattedTableName} } from '#server/db/schemas/tables'

export const dbSchema${formattedTableName}Select = createSelectSchema(dbTable${formattedTableName})
export const dbSchema${formattedTableName}Insert = createInsertSchema(dbTable${formattedTableName})
export const dbSchema${formattedTableName}Update = createUpdateSchema(dbTable${formattedTableName})

export type DBSelect${formattedTableName} = InferSelectModel<typeof ${formattedTableName}Table>
export type DBInsert${formattedTableName} = InferInsertModel<typeof ${formattedTableName}Table>
`.trim()
}

const filesToCreate = [
  {
    path: `server/db/schemas/tables/${tableName}.ts`,
    content: getTableTemplate(tableName),
  },
  {
    path: `shared/schemas/db/${tableName}.ts`,
    content: getSchemaTemplate(tableName),
  },
]

const indexFilePath = `server/db/schemas/tables/index.ts`
const exportLine = `export * from './${tableName}';\n`

// Create files
filesToCreate.forEach((file) => {
  const dir = path.dirname(file.path)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  if (!fs.existsSync(file.path)) {
    fs.writeFileSync(file.path, file.content)
    console.log(`✅ Created: ${file.path}`)
  }
  else {
    console.log(`⚠️ File already exists: ${file.path}`)
  }
})

// Append to index.ts if not already exported
if (fs.existsSync(indexFilePath)) {
  fs.appendFileSync(indexFilePath, exportLine)
}
else {
  fs.writeFileSync(indexFilePath, exportLine)
  console.log(`✅ Created index.ts and added export`)
}
