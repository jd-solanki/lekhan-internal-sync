import type { TSESTree } from '@typescript-eslint/utils'
import { ESLintUtils } from '@typescript-eslint/utils'

const createRule = ESLintUtils.RuleCreator(
  name => `https://example.com/rule/${name}`,
)

const TYPE_FUNCTION_PREFIXES: Record<string, string> = {
  InferSelectModel: 'DBSelect',
  InferInsertModel: 'DBInsert',
}

function isInferTypeCall(node: TSESTree.Node | undefined): node is TSESTree.TSTypeReference {
  if (node?.type !== 'TSTypeReference')
    return false
  if (node.typeName.type !== 'Identifier')
    return false
  return node.typeName.name in TYPE_FUNCTION_PREFIXES
}

function toPascalCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function getEntityFromTypeOf(typeRef: TSESTree.TSTypeReference): string | null {
  // Check for InferSelectModel<typeof dbTableUser>
  const typeArg = typeRef.typeArguments?.params[0]
  if (
    typeArg?.type === 'TSTypeQuery'
    && typeArg.exprName.type === 'Identifier'
  ) {
    const tableVar = typeArg.exprName.name
    // Remove dbTable prefix
    if (tableVar.startsWith('dbTable')) {
      return tableVar.slice(7) // Remove 'dbTable'
    }
    return tableVar
  }
  return null
}

export const dbTypeNaming = createRule({
  name: 'db-type-naming',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce DB type aliases use DBSelect<Entity> or DBInsert<Entity> pattern',
    },
    messages: {
      invalidNaming: 'Type "{{actual}}" must be "{{expected}}" (pattern: {{prefix}}<Entity> from {{typeName}}<typeof dbTable<Entity>>)',
    },
    schema: [],
  },
  defaultOptions: [],

  create(context) {
    return {
      ExportNamedDeclaration(node) {
        // Check: export type Name = InferSelectModel<typeof dbTableUser>
        if (node.declaration?.type === 'TSTypeAliasDeclaration') {
          const typeAlias = node.declaration

          if (!isInferTypeCall(typeAlias.typeAnnotation))
            return

          const typeRef = typeAlias.typeAnnotation
          const typeName = typeRef.typeName.type === 'Identifier' ? typeRef.typeName.name : ''
          const expectedPrefix = TYPE_FUNCTION_PREFIXES[typeName]
          const entityName = getEntityFromTypeOf(typeRef)

          const actualName = typeAlias.id.name

          if (!actualName.startsWith(expectedPrefix)) {
            const expected = entityName
              ? `${expectedPrefix}${toPascalCase(entityName)}`
              : `${expectedPrefix}<Entity>`

            context.report({
              node: typeAlias.id,
              messageId: 'invalidNaming',
              data: {
                actual: actualName,
                expected,
                prefix: expectedPrefix,
                typeName,
              },
            })
            return
          }

          // Validate full pattern if entity known
          if (entityName) {
            const pascalEntity = toPascalCase(entityName)
            const expected = `${expectedPrefix}${pascalEntity}`

            if (actualName !== expected) {
              context.report({
                node: typeAlias.id,
                messageId: 'invalidNaming',
                data: {
                  actual: actualName,
                  expected,
                  prefix: expectedPrefix,
                  typeName,
                },
              })
            }
          }
        }
      },
    }
  },
})
