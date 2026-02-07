import { describe, expect, expectTypeOf, it } from 'vitest'
import * as z from 'zod'
import { partialParse } from '~~/layers/01.base/shared/utils/validation'

describe('partialParse', () => {
  describe('runtime behavior', () => {
    describe('with schema defaults', () => {
      const schemaWithDefaults = z.object({
        page: z.coerce.number().min(1).default(1),
        size: z.coerce.number().min(1).max(100).default(10),
        search: z.string().default(''),
      })

      it('should apply schema defaults when fields are missing', () => {
        const result = partialParse(schemaWithDefaults, {})
        expect(result).toEqual({
          page: 1,
          size: 10,
          search: '',
        })
      })

      it('should use provided values over schema defaults', () => {
        const result = partialParse(schemaWithDefaults, { page: 5, size: 20 })
        expect(result).toEqual({
          page: 5,
          size: 20,
          search: '',
        })
      })

      it('should coerce types and apply defaults', () => {
        const result = partialParse(schemaWithDefaults, { page: '3' })
        expect(result).toEqual({
          page: 3,
          size: 10,
          search: '',
        })
      })

      it('should handle partial invalid data with schema defaults', () => {
        const result = partialParse(schemaWithDefaults, {
          page: 'invalid',
          size: 25,
          search: 'test',
        })
        expect(result).toEqual({
          page: 1, // schema default applied because 'invalid' failed validation
          size: 25,
          search: 'test',
        })
      })
    })

    describe('without schema defaults', () => {
      const schemaNoDefaults = z.object({
        page: z.coerce.number().min(1),
        size: z.coerce.number().min(1).max(100),
        search: z.string(),
      })

      it('should return empty object when no valid data', () => {
        const result = partialParse(schemaNoDefaults, {})
        expect(result).toEqual({})
      })

      it('should only include valid fields', () => {
        const result = partialParse(schemaNoDefaults, {
          page: 5,
          size: 'invalid',
          search: 'test',
        })
        expect(result).toEqual({
          page: 5,
          search: 'test',
        })
      })

      it('should coerce valid types', () => {
        const result = partialParse(schemaNoDefaults, {
          page: '3',
          size: '25',
          search: 'test',
        })
        expect(result).toEqual({
          page: 3,
          size: 25,
          search: 'test',
        })
      })
    })

    describe('with runtime defaults', () => {
      const schema = z.object({
        page: z.coerce.number().min(1),
        size: z.coerce.number().min(1).max(100),
        search: z.string(),
        sortBy: z.enum(['name', 'date', 'size']),
      })

      it('should apply runtime defaults for missing fields', () => {
        const defaults = { page: 1, size: 20, search: '', sortBy: 'name' as const }
        const result = partialParse(schema, {}, defaults)
        expect(result).toEqual({
          page: 1,
          size: 20,
          search: '',
          sortBy: 'name',
        })
      })

      it('should prefer provided data over runtime defaults', () => {
        const defaults = { page: 1, size: 20 }
        const result = partialParse(schema, { page: 5, search: 'test' }, defaults)
        expect(result).toEqual({
          page: 5,
          size: 20,
          search: 'test',
        })
      })

      it('should use runtime defaults when validation fails', () => {
        const defaults = { page: 1, size: 20 }
        const result = partialParse(schema, {
          page: 'invalid',
          size: 999, // exceeds max(100)
          search: 'test',
        }, defaults)
        expect(result).toEqual({
          page: 1, // runtime default used because validation failed
          size: 20, // runtime default used because 999 > 100
          search: 'test',
        })
      })

      it('should ignore invalid runtime defaults', () => {
        const defaults = { page: -1, size: 20 } // page: -1 is invalid (min 1)
        const result = partialParse(schema, {}, defaults)
        expect(result).toEqual({
          size: 20, // only valid default is applied
        })
      })
    })

    describe('with both schema and runtime defaults', () => {
      const schema = z.object({
        page: z.coerce.number().min(1).default(1),
        size: z.coerce.number().min(1).max(100).default(10),
        search: z.string().default(''),
        sortBy: z.enum(['name', 'date', 'size']),
      })

      it('should prefer runtime defaults over schema defaults', () => {
        const runtimeDefaults = { page: 5, size: 25, sortBy: 'date' as const }
        const result = partialParse(schema, {}, runtimeDefaults)
        expect(result).toEqual({
          page: 5, // runtime default overrides schema default
          size: 25, // runtime default overrides schema default
          search: '', // schema default (no runtime default provided)
          sortBy: 'date',
        })
      })
    })

    describe('edge cases', () => {
      const schema = z.object({
        id: z.string().uuid(),
        count: z.number().int().positive(),
        optional: z.string().optional(),
      })

      it('should handle undefined values', () => {
        const result = partialParse(schema, { id: undefined, count: 5 })
        expect(result).toEqual({
          count: 5,
        })
      })

      it('should handle null values', () => {
        const result = partialParse(schema, { id: null, count: 5 })
        expect(result).toEqual({
          count: 5,
        })
      })

      it('should handle empty strings for required fields', () => {
        const result = partialParse(schema, { id: '', count: 5 })
        expect(result).toEqual({
          count: 5,
        })
      })

      it('should handle optional fields correctly', () => {
        const result = partialParse(schema, {
          id: '123e4567-e89b-12d3-a456-426614174000',
          count: 5,
          optional: 'test',
        })
        expect(result).toEqual({
          id: '123e4567-e89b-12d3-a456-426614174000',
          count: 5,
          optional: 'test',
        })
      })
    })
  })

  describe('type safety', () => {
    const schema = z.object({
      page: z.coerce.number().min(1).default(1),
      size: z.coerce.number().min(1).max(100).default(10),
      search: z.string().default(''),
    })

    interface ExpectedOutput {
      page?: number
      size?: number
      search?: string
    }

    it('should return correct type without defaults', () => {
      const result = partialParse(schema, { page: 1 })
      expectTypeOf(result).toEqualTypeOf<ExpectedOutput>()
    })

    it('should accept type-safe runtime defaults', () => {
      const validDefaults = { page: 1, size: 20, search: 'test' }
      const result = partialParse(schema, {}, validDefaults)
      expectTypeOf(result).toEqualTypeOf<ExpectedOutput>()
    })

    it('should allow partial runtime defaults', () => {
      const partialDefaults = { page: 1 }
      const result = partialParse(schema, {}, partialDefaults)
      expectTypeOf(result).toEqualTypeOf<ExpectedOutput>()
    })

    it('should infer correct types for complex schemas', () => {
      const complexSchema = z.object({
        id: z.string(),
        metadata: z.object({
          version: z.number(),
          tags: z.array(z.string()),
        }),
        status: z.enum(['active', 'inactive']),
      })

      interface ComplexExpectedOutput {
        id?: string
        metadata?: {
          version: number
          tags: string[]
        }
        status?: 'active' | 'inactive'
      }

      const result = partialParse(complexSchema, {})
      expectTypeOf(result).toEqualTypeOf<ComplexExpectedOutput>()
    })
  })
})
