import type { SQL } from 'drizzle-orm'
import type { PgSelect, PgSelectQueryBuilder, PgTable } from 'drizzle-orm/pg-core'
import type { DBOrTx } from '~~/server/db'
import { db } from '~~/server/db'

interface PaginationOptions {
  page?: number
  pageSize?: number
}

type CrudParamWhere = ((aliases: PgSelectQueryBuilder['_']['selection']) => SQL | undefined) | SQL | undefined

/**
 * CRUD utility class for Drizzle ORM with PostgreSQL
 */
class BaseCrud<T extends PgTable> {
  transaction = db.transaction

  constructor(
    private readonly table: T,
  ) {
    this.table = table
  }

  async create(newItem: T['$inferInsert'], options?: { dbOrTx?: DBOrTx }): Promise<T['$inferSelect']> {
    const { dbOrTx = db } = options || {}
    const [result] = await dbOrTx.insert(this.table).values(newItem).returning()
    return result as T['$inferSelect']
  }

  async createMulti(newItems: T['$inferInsert'][], options?: { dbOrTx?: DBOrTx }): Promise<T['$inferSelect'][]> {
    const { dbOrTx = db } = options || {}
    const result = await dbOrTx.insert(this.table).values(newItems).returning()
    return result
  }

  async patch(params: { patchedItem: Partial<T['$inferInsert']>, where: SQL | undefined }, options?: { dbOrTx?: DBOrTx }) {
    const { dbOrTx = db } = options || {}
    return await dbOrTx.update(this.table).set(params.patchedItem).where(params.where).returning()
  }

  async get(where: CrudParamWhere): Promise<T['$inferSelect'] | null> {
    const [result] = await db.select().from(this.table as PgTable).where(where).limit(1)
    return result || null
  }

  async getMulti(where: CrudParamWhere, pagination?: PaginationOptions): Promise<T['$inferSelect'][]> {
    const baseQuery = db.select().from(this.table as PgTable).where(where)

    if (pagination) {
      return await BaseCrud.withPagination(baseQuery.$dynamic(), pagination)
    }

    return await baseQuery
  }

  async getOr404(where: CrudParamWhere): Promise<T['$inferSelect']> {
    const result = await this.get(where)
    if (!result) {
      throw createError({
        statusCode: 404,
        message: `Unable to find the requested resource.`,
      })
    }
    return result
  }

  static withPagination<T extends PgSelect>(
    qb: T,
    options?: PaginationOptions,
  ) {
    const { page = 1, pageSize = 10 } = options || {}
    return qb.limit(pageSize).offset((page - 1) * pageSize)
  }
}

export { BaseCrud }
