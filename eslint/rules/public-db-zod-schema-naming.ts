import type { TSESTree } from '@typescript-eslint/utils'
import { ESLintUtils } from '@typescript-eslint/utils'

const createRule = ESLintUtils.RuleCreator(
  name => `https://example.com/rule/${name}`,
)

const ALLOWED_CHAIN_METHODS = new Set([
  'pick',
  'omit',
  'partial',
  'required',
  'refine',
  'superRefine',
  'transform',
  'pipe',
  'default',
  'catch',
  'describe',
  'meta',
  'brand',
  'readonly',
  'extend',
  'merge',
  'and',
  'or',
  'array',
  'optional',
  'nullable',
  'nullish',
])

const DB_SCHEMA_NAME_RE = /^dbSchema(Select|Insert|Update)([A-Z][A-Za-z0-9]*)$/

const PUBLIC_OPERATION_BY_DB_OPERATION: Record<string, string> = {
  Insert: 'Create',
  Select: 'Read',
  Update: 'Update',
}

function getIdentifierName(node: TSESTree.Pattern): string | null {
  return node.type === 'Identifier' ? node.name : null
}

function getRootDbSchemaFromAllowedChain(node: TSESTree.Expression | null): { dbOperation: string, entity: string } | null {
  if (!node)
    return null

  const chainMethods: string[] = []
  let current: TSESTree.Expression = node

  while (current.type === 'CallExpression') {
    if (
      current.callee.type !== 'MemberExpression'
      || current.callee.computed
      || current.callee.property.type !== 'Identifier'
      || current.callee.object.type === 'Super'
    ) {
      return null
    }

    chainMethods.push(current.callee.property.name)

    const owner = current.callee.object
    if (
      owner.type !== 'Identifier'
      && owner.type !== 'CallExpression'
      && owner.type !== 'MemberExpression'
      && owner.type !== 'ChainExpression'
    ) {
      return null
    }

    if (owner.type === 'ChainExpression') {
      if (owner.expression.type !== 'CallExpression' && owner.expression.type !== 'MemberExpression' && owner.expression.type !== 'Identifier')
        return null
      current = owner.expression
      continue
    }

    if (owner.type === 'MemberExpression') {
      return null
    }

    current = owner
  }

  if (current.type !== 'Identifier')
    return null

  if (!chainMethods.length)
    return null

  if (!chainMethods.every(method => ALLOWED_CHAIN_METHODS.has(method)))
    return null

  const match = current.name.match(DB_SCHEMA_NAME_RE)
  if (!match)
    return null

  const [, dbOperation, entity] = match
  if (!dbOperation || !entity)
    return null

  return { dbOperation, entity }
}

export const publicDbZodSchemaNaming = createRule({
  name: 'public-db-zod-schema-naming',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce publicSchema<Operation><Entity> naming for db-derived zod schemas',
    },
    messages: {
      invalidNaming: 'DB-derived public schema "{{actual}}" must be named "{{expected}}"',
    },
    schema: [],
  },
  defaultOptions: [],

  create(context) {
    return {
      VariableDeclarator(node) {
        if (node.parent.kind !== 'const')
          return

        const variableName = getIdentifierName(node.id)
        if (!variableName)
          return

        const rootDbSchema = getRootDbSchemaFromAllowedChain(node.init)
        if (!rootDbSchema)
          return

        const publicOperation = PUBLIC_OPERATION_BY_DB_OPERATION[rootDbSchema.dbOperation]
        if (!publicOperation)
          return

        const expected = `publicSchema${publicOperation}${rootDbSchema.entity}`

        if (variableName === expected)
          return

        context.report({
          node: node.id,
          messageId: 'invalidNaming',
          data: {
            actual: variableName,
            expected,
          },
        })
      },
    }
  },
})
